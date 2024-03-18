//Making progress - have the colours set fetching on client-side. Need to now get the 'playerColours' or a subset of this working on client-side. May need to use 'DeepMap' instead of map as map is only one level deep.

import { useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { email as emaill } from '../stores/email'
import { playerColours } from '../stores/playerColours'
import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'
let p1c = 'purple'
const supabaseUrl = 'https://kevrfmahhebdhfpkguvd.supabase.co'
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldnJmbWFoaGViZGhmcGtndXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIzNTk2NzAsImV4cCI6MjAxNzkzNTY3MH0.fVLhP_Ea5rG8FGxmquyTauZlr0-nufawkSwIturD3W4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function User({ email, colours }) {
	const $email = useStore(emaill)

	useEffect(() => {
		emaill.set(email)
	}, [email])

	const [test, setTest] = useState([])

	const $playerColours = useStore(playerColours)
	async function testFetch() {
		const { data, error } = await supabase.from('colours').select('*')
		if (error) {
			console.log('error', error)
		} else {
			console.log('data', data)
			playerColours.set(data)
		}
	}
	useEffect(() => {
		testFetch()
	}, [])
	console.log('playerColours', $playerColours)
	/*async function fetchPlayerColours() {
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
			console.log('error', error)
		} else {
			console.log('data', data)
			playerColours.set(data)
		}
	}*/
	return (
		email && (
			<>
				{/*User Menu Button*/}
				<button
					type="button"
					title={`Signed in as ${$email}`}
					className={`user-button group flex h-14 w-14 items-center rounded-full border-[3px] border-solid border-dark-${p1c} hover:border-white hover:bg-gradient-to-r hover:from-dark-red hover:to-light-red`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`mx-auto mb-1 h-8 w-8 fill-light-${p1c} group-hover:fill-white`}
						viewBox="0 0 24 24"
					>
						<path d="M19 7.001c0 3.865-3.134 7-7 7s-7-3.135-7-7c0-3.867 3.134-7.001 7-7.001s7 3.134 7 7.001zm-1.598 7.18c-1.506 1.137-3.374 1.82-5.402 1.82-2.03 0-3.899-.685-5.407-1.822-4.072 1.793-6.593 7.376-6.593 9.821h24c0-2.423-2.6-8.006-6.598-9.819z" />
					</svg>
				</button>
				{/*User Menu*/}
				<ul
					className="user-menu absolute right-0 top-[--header-height] flex hidden w-40 flex-col rounded-l-[--border-radius] border-2
	border-r-0 border-solid border-white bg-gradient-to-r from-light-red to-dark-red py-3"
				>
					<li className="w-full border-l-2 border-solid border-l-light-red py-2 text-center text-xs font-medium text-white">
						Alpha: in progress
					</li>
					<li className="w-full border-l-2 border-solid border-l-light-red text-center font-medium text-white hover:bg-white hover:text-light-red">
						<button
							type="button"
							title="Colour selection menu"
							className="colour-menu-button h-full w-full py-2"
						>
							Player Colours
						</button>
					</li>
					<li className="w-full border-l-2 border-solid border-l-light-red py-2 text-center font-medium text-white hover:bg-white hover:text-light-red">
						Statistics
					</li>
					<li className="group w-full border-l-2 border-solid border-l-light-red py-2 text-center hover:bg-white">
						<a
							href="/api/auth/sign-out"
							className="block h-full w-full font-medium text-white group-hover:text-light-red"
						>
							Sign Out
						</a>
					</li>
				</ul>
				{/*Colour Selection Menu*/}
				{/*<div
	className="user-menu colour-menu hidden absolute right-40 top-[--header-height] rounded-[--border-radius] border-2 border-solid border-light-grey p-4 shadow-lg bg-white"
>
	<form className="space-y-4 flex flex-col" action="/api/player-colours" method="post">
		{["1", "2"].map((player) => {
			let playerColour = (player == "1") ? p1c : p2c
			let playerId = (player == "1") ? p1_id : p2_id
		return (<label for={`player-${player}-colours`}>Player {player}</label>
		<select name={`player-${player}-colours`} id={`player-${player}-colours`}>
			{
				colours.map((colour) => {
					let selected = colour.name == playerColour ? "selected" : false
					return <option value={`{"player_id":"${playerId}", "name":"${colour.name}", "id":"${colour.id}"}`} {selected}>{capitalise(colour.name)}</option>
				})
			}
		</select>
		<div className="flex gap-2">
			<div className={`player-${player}-preview-light bg-light-${playerColour} h-8 w-8`}></div>
			<div className={`player-${player}-preview-dark bg-dark-${playerColour} h-8 w-8`}></div>
		</div>)
		})}
		<button type="submit" className="">Save</button>
	</form>
    </div>*/}
			</>
		)
	)
}
