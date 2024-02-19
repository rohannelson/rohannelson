import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'
export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData()
	const playerOne = parseInt(JSON.parse(formData.get('player-1-colours')).id)
	const playerTwo = parseInt(JSON.parse(formData.get('player-2-colours')).id)
	const { data, error } = await supabase
		.from('profiles')
		.update({ player_1_colour: playerOne, player_2_colour: playerTwo })
		.gt('created_at', '2024-01-01')
		.select()
	if (error) {
		console.log(error)
		return new Response(JSON.stringify(error))
	} else {
		return redirect('/projects/games')
	}
}
