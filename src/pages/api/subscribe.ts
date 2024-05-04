import Brevo from '@getbrevo/brevo'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData()
	console.log(formData)
	const firstName = formData.get('firstName')
	const lastName = formData.get('lastName')
	const email = formData.get('email')
	console.log(firstName, lastName, email)
	let contactsApi = new Brevo.ContactsApi()
	contactsApi.setApiKey(Brevo.ContactsApiApiKeys.apiKey, import.meta.env.BREVO_API)
	let createContact = new Brevo.CreateContact()
	createContact.listIds = [4]
	createContact.updateEnabled = true
	createContact.email = email
	createContact.attributes = { FIRSTNAME: firstName, LASTNAME: lastName, OPT_IN: true }
	const { response, body } = await contactsApi.createContact(createContact)
	if (response) {
		return new Response(JSON.stringify(response.statusCode, response.statusMessage, body))
	}
	return new Response('error')
}
