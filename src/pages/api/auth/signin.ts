import type { APIRoute } from 'astro'
import { supabase } from '../../../lib/supabase'
import { setCookies } from '../../../components/utils.js'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
	const formData = await request.formData()
	const email = formData.get('email')?.toString()
	const password = formData.get('password')?.toString()
	const provider = formData.get('provider')?.toString()

	const validProviders = ['github']

	if (provider && validProviders.includes(provider)) {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: 'http://localhost:4321/api/auth/callback'
			}
		})

		if (error) {
			return new Response(error.message, { status: 500 })
		}
		return redirect(data.url)
	}

	if (!email || !password) {
		return new Response('Email and password are required', { status: 400 })
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	})

	if (error) {
		return new Response(error.message, { status: 500 })
	}
	setCookies(data, cookies)

	const { access_token, refresh_token } = data.session
	return redirect('/projects/games')
}
