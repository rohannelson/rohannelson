import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData()
	const turnstileResponse = await turnstile(request, formData)
	if (turnstileResponse) {
		const firstName = formData.get('firstName')
		const lastName = formData.get('lastName')
		const email = formData.get('email')
		const body = JSON.stringify({
			attributes: {
				Firstname: firstName,
				Lastname: lastName,
				OPT_IN: true
			},
			updateEnabled: true,
			email: email,
			listIds: [4]
		})
		const response = await fetch('https://api.brevo.com/v3/contacts', {
			method: 'post',
			headers: {
				'api-key': import.meta.env.BREVO_API,
				accept: 'application/json',
				'content-type': 'application/json'
			},
			body: body
		})
		if (response) {
			const responseBody = {
				statusCode: response.status,
				statusMessage: response.statusText
			}
			return new Response(JSON.stringify(responseBody))
		}
	}
	return new Response('error')
}

async function turnstile(request, body) {
	// Turnstile injects a token in "cf-turnstile-response".
	const token = body.get('cf-turnstile-response')
	const ip = request.headers.get('CF-Connecting-IP')

	// Validate the token by calling the
	// "/siteverify" API endpoint.
	let formData = new FormData()
	formData.append('secret', import.meta.env.TURNSTILE_SECRET_KEY)
	formData.append('response', token)
	formData.append('remoteip', ip)

	const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
	const result = await fetch(url, {
		body: formData,
		method: 'POST'
	})

	const outcome = await result.json()
	if (outcome.success) {
		return true
	}
	console.log('Turnstile failed: ', outcome)
	return false
}
