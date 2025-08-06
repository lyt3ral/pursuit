import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { application } from '$lib/server/db/schema';
import { and, eq, ilike, desc, count } from 'drizzle-orm';

const ITEMS_PER_PAGE = 5;

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		return {
			applications: [],
			currentPage: 1,
			totalPages: 0
		};
	}

	const query = url.searchParams.get('query');
	const field = url.searchParams.get('field') || 'company';
	const page = parseInt(url.searchParams.get('page') || '1');

	const where = [eq(application.userId, locals.user.id)];

	if (query) {
		where.push(ilike(application[field as keyof typeof application.$inferSelect], `%${query}%`));
	}

	const applications = await db.query.application.findMany({
		where: and(...where),
		orderBy: desc(application.updatedAt),
		limit: ITEMS_PER_PAGE,
		offset: (page - 1) * ITEMS_PER_PAGE
	});

	const totalApplications = await db
		.select({ count: count() })
		.from(application)
		.where(and(...where));
	const totalPages = Math.ceil(totalApplications[0].count / ITEMS_PER_PAGE);

	return {
		applications,
		currentPage: page,
		totalPages,
		searchParams: url.searchParams.toString(),
		searchField: field,
		searchQuery: query || ''
	};
};
