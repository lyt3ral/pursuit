import { WORKDAY_URLS } from './urls';

// --- INTERFACES ---

interface Job {
	title: string;
	location: string;
	url: string;
	posted?: string;
}

interface WorkdayResponse {
	jobPostings?: Array<{
		title?: string;
		displayJobTitle?: string;
		locationsText?: string;
		externalPath?: string;
		postedOn?: string;
	}>;
	total?: number;
}

// --- HELPER FUNCTION ---

function postedToday(postedStr: string): boolean {
	if (!postedStr) {
		return false;
	}
	const s = postedStr.toLowerCase();
	return s.includes('today');
}

// --- SCRAPER FUNCTIONS ---

/**
 * Scrapes a single Workday portal. Tries countryId, then locationHierarchyId, and aborts if both fail.
 */
export async function scrapeWorkdayJobs(
	portalUrl: string,
	searchText: string = '',
	countryId?: string,
	todayOnly: boolean = false,
	locationHierarchyId?: string
): Promise<Job[]> {
	try {
		const url = new URL(portalUrl);
		const hostMatch = url.hostname.match(/^(.*?)\.(wd\d+)\.myworkdayjobs\.com$/);

		if (!hostMatch) {
			throw new Error('Invalid Workday portal URL format');
		}

		const [, company] = hostMatch;
		const pathParts = url.pathname.split('/').filter(Boolean);
		const portal = pathParts[pathParts.length - 1];

		if (!portal) {
			throw new Error('Could not extract portal name from URL');
		}

		const baseUrl = `https://${url.hostname}/wday/cxs/${company}/${portal}/jobs`;
		const jobUrlBase = portalUrl.replace(/\/$/, '');

		console.log(
			`Scraping jobs from: ${baseUrl}${searchText ? ` with search: "${searchText}"` : ''}${
				countryId ? ` (countryId: ${countryId})` : ''
			}${todayOnly ? ' (today only)' : ''}`
		);

		const payload: any = {
			limit: 20,
			offset: 0,
			searchText: searchText,
			appliedFacets: {}
		};

		if (countryId) {
			payload.appliedFacets.locationCountry = [countryId];
		}

		const jobs: Job[] = [];
		const seenUrls = new Set<string>();
		// Flag to prevent an infinite retry loop
		let hasRetriedWithHierarchy = false;

		while (true) {
			const response = await fetch(baseUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				// --- FINALIZED FALLBACK LOGIC for 400 Bad Request ---
				if (response.status === 400) {
					// If the first attempt (with countryId) failed and we have a hierarchyId to try
					if (
						payload.appliedFacets.locationCountry &&
						locationHierarchyId &&
						!hasRetriedWithHierarchy
					) {
						console.warn(
							`▲ [WARNING] Standard country filter failed. Retrying with locationHierarchyId.`
						);
						delete payload.appliedFacets.locationCountry;
						payload.appliedFacets.locationHierarchy1 = [locationHierarchyId];
						hasRetriedWithHierarchy = true; // Mark that we've used our fallback
						continue; // Retry the request with the new filter
					}
					// If any filter has failed and we have no more fallbacks to try
					else {
						console.error(
							`❌ [ERROR] All provided location filters failed for this portal. Aborting scrape for ${portalUrl}.`
						);
						return []; // Return an empty array to stop scraping this portal
					}
				}
				// For any other non-400 error, we still throw
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data: WorkdayResponse = await response.json();
			const postings = data.jobPostings || [];

			console.log(`Found ${postings.length} job postings in batch (offset: ${payload.offset})`);

			if (postings.length === 0) {
				break;
			}

			let newJobsFoundInBatch = false;
			for (const job of postings) {
				const title = job.title || job.displayJobTitle;
				if (!title || !job.externalPath) continue;

				const jobUrl = `${jobUrlBase}${job.externalPath}`;

				if (seenUrls.has(jobUrl)) {
					continue;
				}

				seenUrls.add(jobUrl);
				newJobsFoundInBatch = true;

				const postedStr = job.postedOn || '';
				if (!todayOnly || postedToday(postedStr)) {
					jobs.push({
						title,
						location: job.locationsText || 'Location not specified',
						url: jobUrl,
						posted: job.postedOn
					});
				}
			}

			if (postings.length < payload.limit || !newJobsFoundInBatch) {
				if (!newJobsFoundInBatch && postings.length > 0) {
					console.log('Detected duplicate job batch, ending scrape for this portal.');
				}
				break;
			}

			payload.offset += payload.limit;
		}

		console.log(`Total jobs scraped: ${jobs.length}`);
		return jobs;
	} catch (error) {
		console.error('Error scraping Workday jobs:', error);
		throw error;
	}
}

/**
 * Scrapes all configured Workday portals, passing down all relevant filters.
 */
export async function scrapeAllConfiguredJobs(
	searchText: string = '',
	countryId?: string,
	todayOnly: boolean = false,
	locationHierarchyId?: string
): Promise<Job[]> {
	console.log(`Starting scrape of ${WORKDAY_URLS.length} configured portals`);

	const allJobs: Job[] = [];

	for (const portalUrl of WORKDAY_URLS) {
		try {
			console.log(`\n--- Scraping portal: ${portalUrl} ---`);

			const jobs = await scrapeWorkdayJobs(
				portalUrl,
				searchText,
				countryId,
				todayOnly,
				locationHierarchyId
			);

			allJobs.push(...jobs);
			console.log(`Added ${jobs.length} jobs from this portal`);
		} catch (error) {
			console.error(`Error scraping portal ${portalUrl}:`, error);
		}
	}

	console.log(`\n=== TOTAL JOBS FROM ALL PORTALS: ${allJobs.length} ===`);
	return allJobs;
}
