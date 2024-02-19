import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ cookies, redirect, request }) => {
	cookies.delete('sb-access-token', { path: '/' })
	cookies.delete('sb-refresh-token', { path: '/' })
	const guest = new URL(request.url).searchParams.get('guest')
	if (guest) {
		return redirect('/projects/games')
	}
	return redirect('/sign-in')
}
