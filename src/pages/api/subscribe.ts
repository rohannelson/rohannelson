import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
	try {
		const formData = await request.formData()

		const turnstilePassed = await turnstile(request, formData)
		if (!turnstilePassed) {
			return new Response(JSON.stringify({ error: 'Turnstile failed. Please try again.' }), {
				status: 400
			})
		}

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

		const responseBody = {
			statusCode: response.status,
			statusMessage: response.statusText
		}

		if (!response.ok) {
			const responseText = await response.text()
			console.error('Brevo error:', response.status, responseText)
		}

		return new Response(JSON.stringify(responseBody))
	} catch (error) {
		console.error('Subscribe error:', error)
		return new Response(
			JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
			{ status: 500 }
		)
	}
}

async function turnstile(request, body) {
	try {
		const token = body.get('cf-turnstile-response')
		const ip = request.headers.get('CF-Connecting-IP')

		if (!token) {
			console.error('Turnstile error: no token in form data')
			return false
		}

		let formData = new FormData()
		formData.append('secret', import.meta.env.TURNSTILE_SECRET_KEY)
		formData.append('response', token)
		if (ip) formData.append('remoteip', ip)

		const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
		const result = await fetch(url, {
			body: formData,
			method: 'POST'
		})

		const outcome = await result.json()
		if (outcome.success) {
			return true
		}

		console.error('Turnstile failed:', outcome)
		return false
	} catch (error) {
		console.error('Turnstile error:', error)
		return false
	}
}
