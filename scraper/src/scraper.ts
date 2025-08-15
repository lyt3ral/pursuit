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
 * Scrapes a single Workday portal with a multi-level filter fallback and support for multiple URL formats.
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
        let company: string | undefined;
        let portal: string | undefined;

        // --- REFINED: DUAL URL FORMAT PARSING LOGIC ---
        const pathParts = url.pathname.split('/').filter(Boolean);

        // Handles standard format: company.wdX.myworkdayjobs.com/portal
        if (url.hostname.endsWith('myworkdayjobs.com')) {
            const hostMatch = url.hostname.match(/^(.*?)\.wd\d+\.myworkdayjobs\.com$/);
            company = hostMatch?.[1];
            portal = pathParts[pathParts.length - 1];
        } 
        // Handles new format: wdX.myworkdaysite.com/recruiting/company/portal
        else if (url.hostname.endsWith('myworkdaysite.com')) {
            if (pathParts.length >= 2) {
                // In this format, company and portal are found in the URL path
                company = pathParts[pathParts.length - 2];
                portal = pathParts[pathParts.length - 1];
            }
        }

        // If parsing failed for either format, throw a clear error.
        if (!company || !portal) {
            throw new Error(`Invalid or unsupported Workday URL format: ${portalUrl}`);
        }
        // --- END OF PARSING LOGIC ---

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
            appliedFacets: {},
        };

        // Start with the most common filter format if a countryId is provided
        if (countryId) {
            payload.appliedFacets.locationCountry = [countryId];
        }

        const jobs: Job[] = [];
        const seenUrls = new Set<string>();
        
        while (true) {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                if (response.status === 400 && countryId) {
                    // --- MULTI-LEVEL FALLBACK LOGIC ---
                    
                    // Attempt 1 ('locationCountry') failed, so we try Attempt 2 ('Location_Country')
                    if (payload.appliedFacets.locationCountry) {
                        console.warn(`▲ [WARNING] Filter 'locationCountry' failed. Retrying with 'Location_Country'.`);
                        delete payload.appliedFacets.locationCountry;
                        payload.appliedFacets.Location_Country = [countryId];
                        continue; // Retry the request with the new filter
                    } 
                    // Attempt 2 ('Location_Country') failed, so we try Attempt 3 ('locationHierarchy1')
                    else if (payload.appliedFacets.Location_Country && locationHierarchyId) {
                        console.warn(`▲ [WARNING] Filter 'Location_Country' failed. Retrying with 'locationHierarchy1'.`);
                        delete payload.appliedFacets.Location_Country;
                        payload.appliedFacets.locationHierarchy1 = [locationHierarchyId];
                        continue; // Retry the request with the final fallback
                    }
                    // All available filter attempts have failed for this portal
                    else {
                        console.error(`❌ [ERROR] All provided location filters failed for this portal. Aborting scrape for ${portalUrl}.`);
                        return []; // Stop scraping this portal and return no jobs
                    }
                }
                // For any other non-400 error, we throw to indicate a more serious problem
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
                        posted: job.postedOn,
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
        console.error(`Error scraping Workday jobs for ${portalUrl}:`, error);
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
            
            const jobs = await scrapeWorkdayJobs(portalUrl, searchText, countryId, todayOnly, locationHierarchyId);
            
            allJobs.push(...jobs);
            console.log(`Added ${jobs.length} jobs from this portal`);
        } catch (error) {
            // The error is already logged inside scrapeWorkdayJobs, so we just continue
            console.error(`Could not complete scrape for portal ${portalUrl}. Moving to next.`);
        }
    }

    console.log(`\n=== TOTAL JOBS FROM ALL PORTALS: ${allJobs.length} ===`);
    return allJobs;
}