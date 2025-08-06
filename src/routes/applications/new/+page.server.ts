import { db } from '$lib/server/db';
import { application } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const start = performance.now();

	// Get user from layout (non-null for protected routes)
	const { user } = await parent();
	if (!user) throw redirect(302, '/login');

	const queryStart = performance.now();
	const queryEnd = performance.now();

	console.log(`DB query took ${queryEnd - queryStart} ms`);
	console.log(`Total load function took ${performance.now() - start} ms`);

	return {};
};

export const actions = {
	createApplication: async (event) => {
		// In actions, use locals instead of parent()
		const user = event.locals.user;
		if (!user) return fail(401, { message: 'Unauthorized' });

		const formData = await event.request.formData();
		const role = formData.get('role') as string;
		const company = formData.get('company') as string;
		const type = formData.get('type') as
			| 'FULLTIME'
			| 'PARTTIME'
			| 'CONTRACT'
			| 'INTERNSHIP'
			| 'FREELANCE';
		const location = formData.get('location') as string | null;
		const appliedAtString = formData.get('appliedAt') as string;
		const status = formData.get('status') as
			| 'APPLIED'
			| 'INTERVIEWING'
			| 'OFFER'
			| 'REJECTED'
			| 'GHOSTED';
		const model = formData.get('model') as 'REMOTE' | 'ONSITE' | 'HYBRID';
		const notes = formData.get('notes') as string | null;

		const appliedAt = new Date(appliedAtString);

		if (!role || !company || !type || !appliedAtString || !status || !model) {
			return fail(400, { message: 'All required fields must be filled' });
		}

		try {
			await db.insert(application).values({
				userId: user.id,
				role,
				company,
				type,
				location,
				appliedAt,
				status,
				model,
				notes
			});
		} catch (error) {
			console.error('Failed to insert application:', error);
			return fail(500, { message: 'Could not create the application.' });
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
