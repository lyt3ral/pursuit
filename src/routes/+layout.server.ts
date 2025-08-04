import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Public routes that don't require auth
	const publicRoutes = ['/login', '/register'];

	if (!locals.user && !publicRoutes.includes(url.pathname)) {
		throw redirect(302, '/login');
	}

	return { user: locals.user };
};
