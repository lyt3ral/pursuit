import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { application } from '$lib/server/db/schema';
import { and, eq, ilike, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		return {
			applications: []
		};
	}

	const query = url.searchParams.get('query');
	const field = url.searchParams.get('field') || 'company';

	const where = [eq(application.userId, locals.user.id)];

	if (query) {
		where.push(ilike(application[field as keyof typeof application.$inferSelect], `%${query}%`));
	}

	const applications = await db.query.application.findMany({
		where: and(...where),
		orderBy: desc(application.updatedAt)
	});

	return {
		applications
	};
};