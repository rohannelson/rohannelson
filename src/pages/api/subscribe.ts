import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData()
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
	console.log('body', body)
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
	return new Response('error')
}
