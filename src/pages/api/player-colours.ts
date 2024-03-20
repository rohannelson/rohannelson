import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'
//Used to fetch player id, colour id, and colour name.
export const GET: APIRoute = async ({ request }) => {
	const { data, error } = await supabase.from('profiles').select(`player_1_id,
        player_2_id,
        player_1_colour:players!public_profiles_player_1_id_fkey(
            colour_id,
            colour_name:colours(name)
            ),
        player_2_colour:players!public_profiles_player_2_id_fkey(
            colour_id,
            colour_name:colours(name)
            )`)
	if (error) {
		console.log(error)
	} else {
		const response = {
			player_1: {
				id: data[0].player_1_id,
				colour_id: data[0].player_1_colour?.colour_id ?? 3,
				colour_name: data[0].player_1_colour?.colour_name?.name ?? 'red'
			},
			player_2: {
				id: data[0].player_2_id,
				colour_id: data[0].player_2_colour?.colour_id ?? 1,
				colour_name: data[0].player_2_colour?.colour_name?.name ?? 'green'
			}
		}
		console.log('PlayerColours GET response', response)
		return new Response(JSON.stringify(response))
	}
}
//Used to post selected colours from menu form.
export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData()
	const playerOne = parseInt(JSON.parse(formData.get('player-1-colours')).id)
	const player_1_id = parseInt(JSON.parse(formData.get('player-1-colours')).player_id)
	//console.log('p1 colour id', playerOne, 'p1 id', player_1_id)
	const { p1_data, p1_error } = await supabase
		.from('players')
		.update({ colour_id: playerOne })
		.eq('id', player_1_id)
		.select()
	if (p1_error) {
		console.log(p1_error)
		return new Response(JSON.stringify(p1_error))
	}
	const playerTwo = parseInt(JSON.parse(formData.get('player-2-colours')).id)
	const player_2_id = parseInt(JSON.parse(formData.get('player-2-colours')).player_id)
	//console.log('p2 colour id', playerTwo, 'p2 id', player_2_id)
	const { p2_data, p2_error } = await supabase
		.from('players')
		.update({ colour_id: playerTwo })
		.eq('id', player_2_id)
		.select()
	if (p2_error) {
		console.log(p2_error)
		return new Response(JSON.stringify(p2_error))
	} else {
		return redirect('/projects/games')
	}
}
