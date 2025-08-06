import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { application } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const applicationData = await db.query.application.findFirst({
		where: and(eq(application.id, +params.id), eq(application.userId, locals.user.id))
	});

	if (!applicationData) {
		redirect(302, '/applications');
	}

	return {
		application: applicationData
	};
};

export const actions: Actions = {
	updateApplication: async ({ request, locals, params }) => {
		if (!locals.user) {
			redirect(302, '/login');
		}

		const formData = await request.formData();

		await db
			.update(application)
			.set({
				company: formData.get('company') as string,
				role: formData.get('role') as string,
				status: formData.get('status') as any,
				type: formData.get('type') as any,
				model: formData.get('model') as any,
				location: formData.get('location') as string,
				notes: formData.get('notes') as string,
				updatedAt: new Date()
			})
			.where(and(eq(application.id, +params.id), eq(application.userId, locals.user.id)));

		redirect(302, '/applications');
	}
};