import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { application } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	// If the user is not logged in, redirect them to the login page
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	// fetch applications
	const applications = await db.query.application.findMany({
		where: eq(application.userId, event.locals.user.id)
	});

	// Make user data available to the page
	return {
		user: event.locals.user,
		applications: applications
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
