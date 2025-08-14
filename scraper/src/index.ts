/**
 * Workday Job Scraper for Cloudflare Workers
 *
 * This worker scrapes job postings from Workday portals on a schedule.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Test with: `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"`
 * - Run `npm run deploy` to publish your Worker
 */

import { scrapeAllConfiguredJobs } from './scraper';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		url.pathname = '/__scheduled';
		url.searchParams.append('cron', '* * * * *');
		return new Response(`To test the scheduled handler, try running "curl ${url.href}".`);
	},

	// The scheduled handler runs at the interval set in wrangler.jsonc
	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		console.log(`Scheduled job triggered at ${controller.cron}`);

		try {
			// Configuration for scraping - URLs are read from urls.ts file
			const searchText = 'Software Engineer'; // Example search text
			const countryId = 'c4f78be1a8f14da0ab49ce1162348a5e'; // Default India country ID
			const todayOnly = true; // Set to true to only get jobs posted today

			const jobs = await scrapeAllConfiguredJobs(searchText, countryId, todayOnly);
			console.log(`Scheduled scrape completed: found ${jobs.length} total jobs${todayOnly ? ' (today only)' : ''}`);

			for (const job of jobs) {
				console.log(`Job Title: ${job.title}, Location: ${job.location}, Posted On: ${job.posted}`);
				console.log(`Job URL: ${job.url}`);
			}

			// Here you could store the results in KV, D1, or send notifications
			// For now, we'll just log the job count
		} catch (error) {
			console.error('Error in scheduled job:', error);
		}
	},
} satisfies ExportedHandler<Env>;
