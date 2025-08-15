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
import { fetchWorkdayJobDetails } from './get-details';
import { analyzeJob } from './analyze-job';

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

		// --- BENCHMARKING START ---
		const startTime = performance.now();

		try {
			// Configuration for scraping - URLs are read from urls.ts file
			const searchText = 'Software Engineer';
			const countryId = 'c4f78be1a8f14da0ab49ce1162348a5e';
			const locationHierarchyId = '2fcb99c455831013ea52b82135ba3266';
			const todayOnly = true;

			const jobs = await scrapeAllConfiguredJobs(
				searchText,
				countryId,
				todayOnly,
				locationHierarchyId
			);

			console.log(
				`Scheduled scrape completed: found ${jobs.length} total jobs${todayOnly ? ' (today only)' : ''}`
			);

			for (const job of jobs) {
				console.log(`Job Title: ${job.title}, Location: ${job.location}, Posted On: ${job.posted}`);
				console.log(`Job URL: ${job.url}`);
				const details = await fetchWorkdayJobDetails(job.url);
				console.log(details);
				const analysis = await analyzeJob(job.title, details.jobDescription || '', {
					endpoint: `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct-fast`,
					apiKey: env.WORKERS_AI_KEY,
					maxTokens: 256,
					temperature: 0.0
				});
				console.log(analysis);
			}
		} catch (error) {
			console.error('Error in scheduled job:', error);
		} finally {
			// --- BENCHMARKING END ---
			const endTime = performance.now();
			const durationInSeconds = (endTime - startTime) / 1000;
			console.log(
				`✅ Scheduled job finished. Total execution time: ${durationInSeconds.toFixed(2)} seconds.`
			);
		}
	}
} satisfies ExportedHandler<Env>;
