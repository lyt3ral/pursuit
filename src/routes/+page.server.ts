import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { application } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ parent }) => {
	const start = performance.now();

	const { user } = await parent();
	if (!user) throw redirect(302, '/login');

	const queryStart = performance.now();
	const applications = await db.query.application.findMany({
		where: eq(application.userId, user.id)
	});
	const queryEnd = performance.now();

	console.log(`DB query took ${queryEnd - queryStart} ms`);
	console.log(`Total load function took ${performance.now() - start} ms`);

	return { user, applications };
};

export const actions: Actions = {
	logout: async (event) => {
		// Check for an active session
		if (!event.locals.session) {
			return fail(401); // Unauthorized
		}

		// Invalidate the session in the database
		await auth.invalidateSession(event.locals.session.id);

		// Delete the session cookie from the browser
		auth.deleteSessionTokenCookie(event);

		// Redirect to the login page
		throw redirect(302, '/login');
	}
};
