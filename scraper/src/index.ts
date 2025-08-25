import { scrapeWorkdayJobs } from './scraper';
import { fetchWorkdayJobDetails } from './get-details';
import { analyzeJob } from './analyze-job';
import { WORKDAY_URLS } from './urls';

// structure of the message for the job processor queue
interface JobMessage {
    title: string;
    location: string;
    url: string;
}

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		url.pathname = '/__scheduled';
		url.searchParams.append('cron', '* * * * *');
		return new Response(`To test the scheduled handler, try running "curl ${url.href}".`);
	},

    
    // This function is triggered by the cron schedule.
    // Its only job is to send a message to the url-queue for each portal URL.
     
    async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
        console.log(`Scheduled job triggered at ${controller.cron}. Enqueuing URLs...`);

        try {
            // For each URL, send a message to the first queue
            for (const portalUrl of WORKDAY_URLS) {
                await env.URL_QUEUE.send(portalUrl);
            }
            console.log(`✅ Successfully enqueued ${WORKDAY_URLS.length} portal URLs.`);
        } catch (error) {
            console.error('Error enqueuing URLs:', error);
        }
    },

    // This function is triggered whenever a message is delivered to either of our queues.
     
    async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext): Promise<void> {
        switch (batch.queue) {
            // Scrape a single portal
            case 'url-queue':
                console.log(`Received a batch of ${batch.messages.length} URLs to scrape from url-queue.`);
                for (const message of batch.messages) {
                    try {
                        const portalUrl = message.body as string;
                        console.log(`Scraping portal: ${portalUrl}`);
                        
                        const searchText = 'Software Engineer';
                        const countryId = 'c4f78be1a8f14da0ab49ce1162348a5e';
                        const locationHierarchyId = '2fcb99c455831013ea52b82135ba3266';
                        const todayOnly = true;

                        const jobs = await scrapeWorkdayJobs(portalUrl, searchText, countryId, todayOnly, locationHierarchyId);

                        // For each job found, send it to the next queue for processing
                        await env.JOB_QUEUE.sendBatch(jobs.map(job => ({ body: job })));
                        console.log(`Enqueued ${jobs.length} jobs from ${portalUrl} to job-queue.`);

                    } catch (error) {
                        console.error(`Error processing message from url-queue:`, error);
                        message.retry();
                    }
                }
                break;

            // Process a single job
            case 'job-queue':
                console.log(`Received a batch of ${batch.messages.length} jobs to process from job-queue.`);
                for (const message of batch.messages) {
                    try {
                        const job = message.body as JobMessage;
                        console.log(`Processing job: ${job.title}`);

                        // Fetch details and run analysis
                        const details = await fetchWorkdayJobDetails(job.url);
                        const analysis = await analyzeJob(job.title, details.jobDescription || '', {
                            endpoint: `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct-fast`,
                            apiKey: env.WORKERS_AI_KEY,
                            maxTokens: 256,
                            temperature: 0.0
                        });

                        console.log(`Analysis for ${job.title}:`, analysis);
                        // save results to database in case of fresher job

                    } catch (error) {
                        console.error(`Error processing message from job-queue:`, error);
                        // Optionally, retry the message
                        message.retry();
                    }
                }
                break;
        }
    }
} satisfies ExportedHandler<Env>;
