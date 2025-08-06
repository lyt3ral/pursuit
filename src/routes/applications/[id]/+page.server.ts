import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { application } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		return {
			application: null
		};
	}

	const applicationData = await db.query.application.findFirst({
		where: and(eq(application.id, +params.id), eq(application.userId, locals.user.id))
	});

	return {
		application: applicationData
	};
};