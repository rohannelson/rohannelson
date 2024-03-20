//I'm partway through, not really sure what's going wrong, need to isolate things...
//Need to make sure keys are working. Need to make sure fetching and stores/state is working...
//Need to turn off other prop and get click functionality etc. working on this side...

import { useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { email as emailStore } from '../stores/email'
import { player1Colours, player2Colours } from '../stores/playerColours'
import { capitalise } from './utils'

export default function User({ email, colours }) {
	/*Set email/logged-in store*/
	console.log('React email prop', email)
	const $email = useStore(emailStore)
	useEffect(() => {
		console.log('useEffect email', email)
		emailStore.set(email)
		console.log('Post useEffect $email 1', $email)
	}, [email])
	console.log('Post useEffect $email 2', $email)

	/*Set playerColours stores*/
	const $player1Colours = useStore(player1Colours)
	const $player2Colours = useStore(player2Colours)
	useEffect(() => {
		async function fetchPlayerColours() {
			const response = await fetch('/api/player-colours')
			const data = await response.json()
			console.log('GET data on clientside', data)
			player1Colours.set(data.player_1)
			player2Colours.set(data.player_2)
		}
		fetchPlayerColours()
	}, [])

	//const p1c = $player1Colours?.colour_name ?? 'red'
	//const p2c = $player2Colours?.colour_name ?? 'green'
	let p1c = 'purple'
	console.log('player1Colours', $player1Colours)
	//console.log('player2Colours', $player2Colours)

	function UserMenuButton() {
		return (
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
		)
	}

	function UserMenu() {
		return (
			<ul
				className="user-menu absolute right-0 top-[--header-height] flex w-40 flex-col rounded-l-[--border-radius] border-2
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
		)
	}

	function ColourSelectionMenu() {
		function PlayerColourSelection({ playerNumber, playerProps }) {
			return (
				<>
					<label for={`player-${playerNumber}-colours`}>Player {playerNumber}</label>
					<select
						name={`player-${playerNumber}-colours`}
						defaultOption={playerProps.colour_name}
						id={`player-${playerNumber}-colours`}
					>
						{colours.map((colour, i) => {
							return (
								<option
									value={`{"player_id":"${playerProps.id}", "name":"${colour.name}", "id":"${colour.id}"}`}
									key={i}
								>
									{capitalise(colour.name)}
								</option>
							)
						})}
					</select>
					<div className="flex gap-2">
						<div
							className={`player-${playerNumber}-preview-light bg-light-${playerProps.colour_name} h-8 w-8`}
						></div>
						<div
							className={`player-${playerNumber}-preview-dark bg-dark-${playerProps.colour_name} h-8 w-8`}
						></div>
					</div>
				</>
			)
		}
		return (
			<div className="user-menu colour-menu absolute right-40 top-[--header-height] rounded-[--border-radius] border-2 border-solid border-light-grey bg-white p-4 shadow-lg">
				<form className="flex flex-col space-y-4" action="/api/player-colours" method="post">
					<PlayerColourSelection playerNumber="1" playerProps={$player1Colours} />
					<PlayerColourSelection playerNumber="2" playerProps={$player2Colours} />
					<button type="submit" className="">
						Save
					</button>
				</form>
			</div>
		)
	}

	return (
		email && (
			<>
				<UserMenuButton />
				<UserMenu />
				<ColourSelectionMenu />
			</>
		)
	)
}
