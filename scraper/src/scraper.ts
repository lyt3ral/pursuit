import { WORKDAY_URLS } from './urls';

interface Job {
	title: string;
	location: string;
	url: string;
	posted?: string;
}

interface WorkdayResponse {
	jobPostings: Array<{
		title?: string;
		displayJobTitle?: string;
		locationsText?: string;
		externalPath: string;
		postedOn?: string;
	}>;
}

function postedToday(postedStr: string): boolean {
	// Check if job was posted today only
	if (!postedStr) {
		return false;
	}

	const s = postedStr.toLowerCase();
	return s.includes('today');
}

export async function scrapeWorkdayJobs(
	portalUrl: string,
	searchText: string = '',
	countryId?: string,
	todayOnly: boolean = false
): Promise<Job[]> {
	try {
		// Parse the portal URL to extract company and domain info
		const url = new URL(portalUrl);
		const hostMatch = url.hostname.match(/^(.*?)\.(wd\d+)\.myworkdayjobs\.com$/);

		if (!hostMatch) {
			throw new Error('Invalid Workday portal URL format');
		}

		const [, company, domainPrefix] = hostMatch;
		const portal = url.pathname.split('/').filter(Boolean)[0];

		if (!portal) {
			throw new Error('Could not extract portal name from URL');
		}

		const baseUrl = `https://${company}.${domainPrefix}.myworkdayjobs.com/wday/cxs/${company}/${portal}/jobs`;

		console.log(
			`Scraping jobs from: ${baseUrl}${searchText ? ` with search: "${searchText}"` : ''}${
				countryId ? ` filtered by country: ${countryId}` : ''
			}${todayOnly ? ' (today only)' : ''}`
		);

		const payload: any = {
			limit: 20,
			offset: 0,
			searchText: searchText,
		};

		// Add country filter if provided
		if (countryId) {
			payload.appliedFacets = {
				locationCountry: [countryId],
			};
		}

		const jobs: Job[] = [];

		// Continue fetching until we get all jobs
		while (true) {
			const response = await fetch(baseUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data: WorkdayResponse = await response.json();
			const postings = data.jobPostings || [];

			console.log(`Found ${postings.length} job postings in batch (offset: ${payload.offset})`);

			for (const job of postings) {
				const title = job.title || job.displayJobTitle;
				if (!title) continue; // sanity check

				const postedStr = job.postedOn || '';

				if (todayOnly && !postedToday(postedStr)) {
					continue;
				}

				jobs.push({
					title,
					location: job.locationsText || 'Location not specified',
					url: `https://${company}.${domainPrefix}.myworkdayjobs.com/${portal}${job.externalPath}`,
					posted: job.postedOn,
				});
			}

			// If we got fewer postings than the limit, we've reached the end
			if (postings.length < payload.limit) {
				break;
			}

			// Move to the next batch
			payload.offset += payload.limit;
		}

		console.log(`Total jobs scraped: ${jobs.length}`);

		return jobs;
	} catch (error) {
		console.error('Error scraping Workday jobs:', error);
		throw error;
	}
}

export async function scrapeAllConfiguredJobs(searchText: string = '', countryId?: string, todayOnly: boolean = false): Promise<Job[]> {
	console.log(`Starting scrape of ${WORKDAY_URLS.length} configured portals`);

	const allJobs: Job[] = [];

	for (const portalUrl of WORKDAY_URLS) {
		try {
			console.log(`\n--- Scraping portal: ${portalUrl} ---`);
			const jobs = await scrapeWorkdayJobs(portalUrl, searchText, countryId, todayOnly);
			allJobs.push(...jobs);
			console.log(`Added ${jobs.length} jobs from this portal`);
		} catch (error) {
			console.error(`Error scraping portal ${portalUrl}:`, error);
			// Continue with other portals even if one fails
		}
	}

	console.log(`\n=== TOTAL JOBS FROM ALL PORTALS: ${allJobs.length} ===`);
	return allJobs;
}
