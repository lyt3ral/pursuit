export type JobDetails = {
	jobDescription: string | null;
	hiringOrganization: string | null;
	employmentType: string | string[] | null;
	title: string | null;
	datePosted: string | null;
	validThrough: string | null;
	source: 'ld+json' | 'meta' | 'regex' | 'none';
};

/**
 * Fetch a Workday job page and extract job details.
 * Uses only fetch() and string parsing — no DOM, no eval.
 *
 * Note: In browsers you may hit CORS. Run server-side (Node 18+) to avoid that.
 */
export async function fetchWorkdayJobDetails(url: string): Promise<JobDetails> {
	const res = await fetch(url, { headers: { Accept: 'text/html' } });
	if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
	const html = await res.text();

	const decodeHtmlEntities = (s: string) =>
		s
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'");

	const parseJsonSafe = (txt: string) => {
		try {
			return JSON.parse(txt);
		} catch {
			return null;
		}
	};

	const normalizeStr = (v: unknown) => (v == null ? null : String(v).trim());

	// Helper: try to extract content attribute from a matching meta tag
	const extractMeta = (attrNames: string[]) => {
		for (const name of attrNames) {
			// match both property="..." and name="..."
			const re = new RegExp(`<meta[^>]*(?:property|name)=["']${escapeRegExp(name)}["'][^>]*>`, 'i');
			const m = html.match(re);
			if (!m) continue;
			const contentMatch = m[0].match(/content=(["'])([\s\S]*?)\1/i);
			if (contentMatch && contentMatch[2]) return decodeHtmlEntities(contentMatch[2].trim());
		}
		return null;
	};

	// Escape utility for regex building
	function escapeRegExp(s: string) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	// 1) JSON-LD scripts
	const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
	let m: RegExpExecArray | null;
	while ((m = ldJsonRegex.exec(html)) !== null) {
		const raw = m[1].trim();
		const parsed = parseJsonSafe(raw);
		if (!parsed) continue;

		const items = Array.isArray(parsed) ? parsed : [parsed];
		for (const item of items) {
			if (!item || typeof item !== 'object') continue;

			// Detect JobPosting-like objects
			const type = item['@type'] ?? item['type'] ?? '';
			const isJob =
				(typeof type === 'string' && /job/i.test(type)) ||
				Boolean(item.title || item.hiringOrganization || item.datePosted);

			if (!isJob) continue;

			const jobDescriptionRaw = item.jobDescription ?? item.description ?? null;
			const jobDescription =
				jobDescriptionRaw && typeof jobDescriptionRaw === 'object'
					? normalizeStr(
							jobDescriptionRaw.text ?? jobDescriptionRaw['@value'] ?? String(jobDescriptionRaw)
						)
					: normalizeStr(jobDescriptionRaw);

			// hiring organization may be an object or string
			let hiringOrganization: string | null = null;
			const ho = item.hiringOrganization ?? item.hiringOrganizationName ?? item.hiringOrg;
			if (typeof ho === 'string') hiringOrganization = normalizeStr(ho);
			else if (ho && typeof ho === 'object')
				hiringOrganization = normalizeStr(
					ho.name ?? ho['@name'] ?? ho['legalName'] ?? ho.organizationName
				);

			const employmentType =
				item.employmentType ?? (item.employment && item.employment.type) ?? null;
			const title = normalizeStr(item.title ?? item.name ?? null);
			const datePosted = normalizeStr(item.datePosted ?? null);
			const validThrough = normalizeStr(item.validThrough ?? item.expirationDate ?? null);

			return {
				jobDescription: jobDescription ? decodeHtmlEntities(jobDescription) : null,
				hiringOrganization: hiringOrganization ? decodeHtmlEntities(hiringOrganization) : null,
				employmentType: employmentType ?? null,
				title: title ? decodeHtmlEntities(title) : null,
				datePosted,
				validThrough,
				source: 'ld+json'
			};
		}
	}

	// 2) Meta tag fallbacks (og:description / description / og:title / title)
	const metaDescription = extractMeta(['og:description', 'description']);
	const metaTitle = extractMeta(['og:title', 'title']);
	const metaHiringOrg = null; // rarely present in meta; we'll try regex later

	if (metaDescription || metaTitle) {
		return {
			jobDescription: metaDescription ? decodeHtmlEntities(metaDescription) : null,
			hiringOrganization: null,
			employmentType: null,
			title: metaTitle ? decodeHtmlEntities(metaTitle) : null,
			datePosted: null,
			validThrough: null,
			source: 'meta'
		};
	}

	// 3) tolerant regex fallbacks for individual fields inside scripts/html
	// Helper to find JSON-like "key": "value" pairs and unescape them properly
	function findJsonLikeString(key: string): string | null {
		const re = new RegExp(
			`["']${escapeRegExp(key)}["']\\s*:\\s*("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')`,
			'i'
		);
		const mm = html.match(re);
		if (!mm) return null;
		const quoted = mm[1];
		try {
			// JSON.parse the quoted chunk to unescape sequences
			return decodeHtmlEntities(JSON.parse(quoted));
		} catch {
			// fallback: strip surrounding quotes and unescape common sequences
			const inner = quoted.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
			return decodeHtmlEntities(inner);
		}
	}

	const jd = findJsonLikeString('jobDescription') ?? findJsonLikeString('description');
	const hoCandidate =
		findJsonLikeString('hiringOrganization') ??
		findJsonLikeString('hiringOrganizationName') ??
		null;
	const empType = findJsonLikeString('employmentType') ?? null;
	const titleCandidate = findJsonLikeString('title') ?? findJsonLikeString('name');
	const datePostedCandidate = findJsonLikeString('datePosted') ?? null;
	const validThroughCandidate =
		findJsonLikeString('validThrough') ?? findJsonLikeString('expirationDate') ?? null;

	if (
		jd ||
		hoCandidate ||
		empType ||
		titleCandidate ||
		datePostedCandidate ||
		validThroughCandidate
	) {
		return {
			jobDescription: jd ? normalizeStr(jd) : null,
			hiringOrganization: hoCandidate ? normalizeStr(hoCandidate) : null,
			employmentType: empType ? tryParseEmploymentType(empType) : null,
			title: titleCandidate ? normalizeStr(titleCandidate) : null,
			datePosted: datePostedCandidate ? normalizeStr(datePostedCandidate) : null,
			validThrough: validThroughCandidate ? normalizeStr(validThroughCandidate) : null,
			source: 'regex'
		};
	}

	// Nothing found
	return {
		jobDescription: null,
		hiringOrganization: null,
		employmentType: null,
		title: null,
		datePosted: null,
		validThrough: null,
		source: 'none'
	};

	// Parse employmentType: sometimes it's a JSON array like ["FULL_TIME"] or single string
	function tryParseEmploymentType(value: string): string | string[] {
		// attempt to parse JSON if it looks like an array
		const trimmed = value.trim();
		if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
			const parsed = parseJsonSafe(trimmed);
			if (parsed) return parsed;
		}
		// otherwise return as simple string (comma-split if multiple present)
		if (trimmed.includes(',')) return trimmed.split(',').map((s) => s.trim());
		return trimmed;
	}
}
