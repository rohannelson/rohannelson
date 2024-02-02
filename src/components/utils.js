import { supabase } from '../lib/supabase'

export const capitalise = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const capitaliseAll = (str) => {
	return str
		.split(' ')
		.map((word) => capitalise(word))
		.join(' ')
}

export const setCookies = (data, cookies) => {
	const { access_token, refresh_token } = data.session
	cookies.set('sb-access-token', access_token, {
		path: '/',
		maxAge: 60 * 60 /*1 hour*/,
		httpOnly: true,
		sameSite: true,
		secure: true
	})
	cookies.set('sb-refresh-token', refresh_token, {
		path: '/',
		maxAge: 60 * 60 * 24 * 31 /*1 month*/,
		httpOnly: true,
		sameSite: true,
		secure: true
	})
}

export const emailExcerpt = (email, maxLength = 6) => {
	let user = email.substring(0, email.indexOf('@'))
	let output = user.length > maxLength ? user.substring(0, maxLength) + '...' : user
	return output
}

export const fetchColours = async () => {
	const { data, error } = await supabase.from('colours').select('*')
	if (error) {
		console.log(error)
	} else {
		return data
	}
}
