// job-analyzer.ts
// Example A: local module import for Cloudflare Worker projects.
// Exports:
//  - buildJobPrompt(title, description)
//  - analyzeJob(title, description, opts)
//
// Usage: import { analyzeJob } from "./job-analyzer"; and call analyzeJob(...) from your index.ts

export type AnalyzeOpts = {
	// Full API URL (e.g. "https://gateway.ai.cloudflare.com/v1/<acct>/<gateway>/workers-ai/<model>")
	endpoint: string;
	// Bearer token (store as a secret in Wrangler / Cloudflare and pass via env)
	apiKey: string;
	// Optional fine-tuning of generation
	maxTokens?: number;
	temperature?: number;
	// Optional fetch init overrides if you need custom headers/timeouts etc.
	fetchInit?: RequestInit;
};

/** Build a strict JSON-output prompt for job parsing. */
export function buildJobPrompt(title: string, description: string): string {
	return `
You are a structured-data extractor that receives a Job TITLE and DESCRIPTION.
Return strictly valid JSON (no commentary, no markdown, no extra properties) with EXACTLY these fields:

{
  "isFresher": <true|false>,              // true when the role is explicitly entry-level / fresher / 0-2 yrs
  "techSkills": "<CSV of technical skills, First-letter-capitalized each item>", 
  "qualifications": "<brief single-line summary of minimum qualifications>"
}

Rules:
- Decide "isFresher" using explicit cues (e.g., "Fresher", "Entry level", "0-2 years", "Graduate", "0-1 years") OR "Junior"/"Trainee"/"Intern".
- If the JD contains phrases like in final year, internship, 0-2 years, entry level, fresher, recent graduate, no experience, foundational knowledge, or willingness to learn, treat it as a fresher/entry-level role (i.e., isFresher: true). 
- Only mark false when the JD explicitly requires several years of experience (e.g., 3+ years, 5 years, senior, lead).
- techSkills: list ONLY technical skills/technologies explicitly required in the JD (no soft skills). Provide them as a comma-separated string. Capitalize each item: e.g., "Python, Docker, SQL".
- qualifications: short single-line summary of minimum required education/degree/certifications and years of experience if stated.
- Keep answers concise and do not include additional fields.

Now analyze this job precisely:
TITLE: ${JSON.stringify(title)}
DESCRIPTION: ${JSON.stringify(description)}
`.trim();
}
// replace your previous analyzeJob with this improved implementation

export async function analyzeJob(
	title: string,
	description: string,
	opts: AnalyzeOpts
): Promise<{
	isFresher: boolean | null;
	techSkills: string | null;
	qualifications: string | null;
	raw: string;
	error?: string;
}> {
	if (!opts?.endpoint) throw new Error('AnalyzeOpts.endpoint is required');
	if (!opts?.apiKey) throw new Error('AnalyzeOpts.apiKey is required');

	const prompt = buildJobPrompt(title, description);

	const payload = {
		messages: [
			{ role: 'system', content: 'You are a JSON-output job parsing assistant.' },
			{ role: 'user', content: prompt }
		],
		max_tokens: opts.maxTokens ?? 512,
		temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.0
	};

	const fetchInit: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${opts.apiKey}`
		},
		body: JSON.stringify(payload),
		...opts.fetchInit
	};

	const resp = await fetch(opts.endpoint, fetchInit);
	const status = resp.status;

	let parsedResp: any;
	try {
		parsedResp = await resp.json();
	} catch (e) {
		const txt = await resp.text();
		return {
			isFresher: null,
			techSkills: null,
			qualifications: null,
			raw: txt,
			error: `Non-JSON response (HTTP ${status})`
		};
	}

	// 1) Try to detect nested "result.response" (Cloudflare REST API shape)
	let rawText: string | null = null;
	let parsedJson: any = null;

	try {
		if (parsedResp && typeof parsedResp === 'object') {
			// If result.response exists and is a string (common Cloudflare shape)
			if (parsedResp.result && typeof parsedResp.result.response === 'string') {
				rawText = parsedResp.result.response;

				// Attempt to parse JSON embedded in the response string (most likely in your case)
				try {
					const maybe = rawText ? JSON.parse(rawText) : null;
					if (maybe && typeof maybe === 'object') {
						parsedJson = maybe;
					}
				} catch {
					// not JSON — leave rawText as-is and continue to other extraction heuristics
				}
			}

			// Some providers return `result` as a string directly
			if (!rawText && typeof parsedResp.result === 'string') {
				rawText = parsedResp.result;
			}
		}
	} catch (err) {
		// ignore and proceed to generic extraction
	}

	// 2) If we still don't have rawText, try common provider shapes (choices, output, etc.)
	if (!rawText) {
		// Helper: extract text from common provider shapes
		function extractText(obj: any): string | null {
			if (!obj) return null;
			if (Array.isArray(obj.choices) && obj.choices.length > 0) {
				const c = obj.choices[0];
				if (c.message?.content) return c.message.content;
				if (typeof c.text === 'string') return c.text;
				if (typeof c.delta?.content === 'string') return c.delta.content;
			}
			if (typeof obj.output === 'string') return obj.output;
			if (typeof obj.result === 'string') return obj.result;
			if (Array.isArray(obj.generations) && obj.generations.length > 0) {
				const g = obj.generations[0];
				if (typeof g.text === 'string') return g.text;
				if (Array.isArray(g) && g[0]?.text) return g[0].text;
			}
			if (typeof obj.text === 'string') return obj.text;
			return null;
		}

		rawText = extractText(parsedResp) ?? JSON.stringify(parsedResp);
	}

	// 3) If parsedJson still null, attempt to extract the first JSON block from rawText
	if (!parsedJson && rawText) {
		const firstBrace = rawText.indexOf('{');
		let candidate = firstBrace >= 0 ? rawText.slice(firstBrace) : rawText;

		// naive parse attempt
		try {
			parsedJson = JSON.parse(candidate);
		} catch {
			// balanced-brace fallback (find first balanced {...})
			let open = 0;
			let endIdx = -1;
			for (let i = 0; i < candidate.length; i++) {
				const ch = candidate[i];
				if (ch === '{') open++;
				else if (ch === '}') {
					open--;
					if (open === 0) {
						endIdx = i;
						break;
					}
				}
			}
			if (endIdx >= 0) {
				const slice = candidate.slice(0, endIdx + 1);
				try {
					parsedJson = JSON.parse(slice);
				} catch {
					parsedJson = null;
				}
			}
		}
	}

	const raw = rawText ?? JSON.stringify(parsedResp);

	if (!parsedJson) {
		return {
			isFresher: null,
			techSkills: null,
			qualifications: null,
			raw,
			error: 'Model output not parseable as JSON after multiple extraction attempts'
		};
	}

	// Normalize extracted fields safely
	const rawIsFresher = parsedJson.isFresher;
	let outIsFresher: boolean | null = null;
	if (rawIsFresher === true || rawIsFresher === 'true') outIsFresher = true;
	else if (rawIsFresher === false || rawIsFresher === 'false') outIsFresher = false;
	else outIsFresher = null;

	const outTech = typeof parsedJson.techSkills === 'string' ? parsedJson.techSkills.trim() : null;
	const outQual =
		typeof parsedJson.qualifications === 'string' ? parsedJson.qualifications.trim() : null;

	return {
		isFresher: outIsFresher,
		techSkills: outTech,
		qualifications: outQual,
		raw
	};
}
