import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'
import { atom } from 'nanostores'

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
		console.log(data)
		return data
	}
}
