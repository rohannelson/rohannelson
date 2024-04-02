import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'
//Used to fetch player id, colour id, and colour name.
export const GET: APIRoute = async ({ request }) => {
	const { data, error } = await supabase.from('profiles').select(`player_1_id,
        player_2_id,
        player_1_wins:players!public_profiles_player_1_id_fkey(
            tictactoe_wins,
            fiar_wins
            ),
        player_2_wins:players!public_profiles_player_2_id_fkey(
            tictactoe_wins,
            fiar_wins
            )`)
	if (error) {
		console.log(error)
	} else {
		const response = {
			player_1_wins: {
				player_number: 1,
				id: data[0]?.player_1_id ?? null,
				tictactoe: data[0]?.player_1_wins?.tictactoe_wins ?? 0,
				fiar: data[0]?.player_1_wins?.fiar_wins ?? 0
			},
			player_2_wins: {
				player_number: 12,
				id: data[0]?.player_2_id ?? null,
				tictactoe: data[0]?.player_2_wins?.tictactoe_wins ?? 0,
				fiar: data[0]?.player_2_wins?.fiar_wins ?? 0
			}
		}
		//console.log('PlayerWins GET response', response)
		return new Response(JSON.stringify(response))
	}
}
//Used to post selected colours from menu form.
export const POST: APIRoute = async ({ request, redirect }) => {
	const body = await request.json()
	const playerData = body.current
	const game = body.changed

	const { p1_data, p1_error } = await supabase
		.from('players')
		.update({ [game + '_wins']: playerData[game] })
		.eq('id', playerData.id)
		.select()
	if (p1_error) {
		console.log(p1_error)
		return new Response(JSON.stringify(p1_error))
	}
	const response = new Response()
	return response
}
