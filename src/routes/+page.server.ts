import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, desc } from 'drizzle-orm';
import { application, job } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, '/login');

	// Kick off queries in parallel without awaiting so the page can stream & show skeletons
	const applicationsPromise = db.query.application.findMany({
		where: eq(application.userId, user.id)
	});

	const jobsPromise = db.query.job.findMany({
		orderBy: desc(job.updatedAt),
		limit: 8,
		with: { company: true }
	});

	// Return deferred promises so {#await} blocks in the page component render fallbacks first
	return {
		user,
		applications: applicationsPromise,
		jobs: jobsPromise
	};
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
