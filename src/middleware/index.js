import { defineMiddleware } from 'astro:middleware'
import { supabase } from '../lib/supabase'
import { setCookies, fetchPlayerColours } from '../components/utils.js'

export const onRequest = defineMiddleware(async (context, next) => {
	let redirectpath = ''
	const handleSession = async (redirectPath = '') => {
		const accessToken = context.cookies.get('sb-access-token')
		const refreshToken = context.cookies.get('sb-refresh-token')
		if (accessToken && refreshToken) {
			const { data, error } = await supabase.auth.setSession({
				refresh_token: refreshToken.value,
				access_token: accessToken.value
			})
			if (error) {
				context.cookies.delete('sb-refresh-token', {
					path: '/'
				})
				context.cookies.delete('sb-access-token', {
					path: '/'
				})
				redirectpath = redirectPath ? redirectPath : ''
			} else {
				setCookies(data, context.cookies)
				context.locals.email = data?.user?.email ?? data?.user?.user_metadata?.email
				console.log('Middleware email', data?.user?.email)
				context.locals.colours = await fetchPlayerColours()
			}
		} else if (refreshToken) {
			const { data, error } = await supabase.auth.refreshSession({
				refresh_token: refreshToken.value
			})

			if (error) {
				context.cookies.delete('sb-refresh-token', {
					path: '/'
				})
				redirectpath = redirectPath ? redirectPath : ''
			} else {
				setCookies(data, context.cookies)
				context.locals.email = data?.user?.email ?? data?.user?.user_metadata?.email
				console.log('Middleware email', data?.user?.email)
				context.locals.colours = await fetchPlayerColours()
			}
		} else {
			redirectpath = redirectPath ? redirectPath : ''
			context.locals.email = 'Guest'
		}
	}
	context.url.pathname == '/projects' && (await handleSession(''))
	context.url.pathname.includes('/projects/') && (await handleSession(''))
	if (redirectpath) {
		return context.redirect(redirectpath)
	}
	return next()
})
