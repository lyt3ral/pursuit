import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { job } from '$lib/server/db/schema';
import { and, ilike, desc, count } from 'drizzle-orm';

// We now return the full (capped) list of jobs for client-side slicing (infinite scroll without extra API route)
const MAX_JOBS_RETURNED = 500; // safety cap

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		return {
			jobs: [],
			currentPage: 1,
			totalPages: 0
		};
	}

	const query = url.searchParams.get('query');
	const field = url.searchParams.get('field') || 'role';
	// page param no longer used for server pagination; kept for backward compatibility
	const page = 1;

	const where = [];

	if (query) {
		where.push(ilike(job[field as keyof typeof job.$inferSelect], `%${query}%`));
	}

	const jobs = await db.query.job.findMany({
		where: and(...where),
		orderBy: desc(job.updatedAt),
		limit: MAX_JOBS_RETURNED,
		with: { company: true }
	});

	const totalJobs = await db
		.select({ count: count() })
		.from(job)
		.where(and(...where));
	const totalJobsCount = totalJobs[0].count;

	return {
		jobs,
		totalJobsCount,
		searchParams: url.searchParams.toString(),
		searchField: field,
		searchQuery: query || ''
	};
};
