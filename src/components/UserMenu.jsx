import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { $player1Colours, $player2Colours } from '../stores/playerColours'
import { $activeMenus } from '../stores/activeMenus'
import { capitalise } from './utils'

export default function UserMenu({ email, colours }) {
	//Set playerColours stores
	const player1Colours = useStore($player1Colours)
	const player2Colours = useStore($player2Colours)
	useEffect(() => {
		async function fetchPlayerColours() {
			const response = await fetch('/api/player-colours')
			const data = await response.json()
			$player1Colours.set(data.player_1)
			$player2Colours.set(data.player_2)
		}
		fetchPlayerColours()
	}, [])
	const p1c = player1Colours?.colour_name ?? 'red'
	const p2c = player2Colours?.colour_name ?? 'green'
	//Set activeMenu store
	const activeMenus = useStore($activeMenus)

	return (
		email &&
		email != 'Guest' && (
			<>
				<UserMenuButton p1c={p1c} email={email} activeMenus={activeMenus} />
				<ul
					className={`${
						activeMenus.userMenu ? null : 'hidden'
					} user-menu absolute right-0 top-[--header-height] flex w-40 flex-col rounded-l-[--border-radius] border-2
	border-r-0 border-solid border-white bg-gradient-to-r from-light-red to-dark-red py-3`}
				>
					<li className="w-full border-l-2 border-solid border-l-light-red text-center font-medium text-white hover:bg-white hover:text-light-red">
						<button
							type="button"
							title="Colour selection menu"
							className="colour-menu-button h-full w-full py-2"
							onClick={() => $activeMenus.setKey('colourMenu', !activeMenus.colourMenu)}
						>
							Player Colours
						</button>
					</li>
					{/*<li className="w-full border-l-2 border-solid border-l-light-red py-2 text-center font-medium text-white hover:bg-white hover:text-light-red">
						Statistics
				</li>*/}
					<li className="group w-full border-l-2 border-solid border-l-light-red py-2 text-center hover:bg-white">
						<a
							href="/api/auth/sign-out"
							className="block h-full w-full font-medium text-white group-hover:text-light-red"
						>
							Sign Out
						</a>
					</li>
				</ul>
				<ColourSelectionMenu
					activeMenus={activeMenus}
					colours={colours}
					player1Colours={player1Colours}
					player2Colours={player2Colours}
					p1c={p1c}
				/>
			</>
		)
	)
}

function UserMenuButton({ p1c, email, activeMenus }) {
	return (
		<button
			type="button"
			onClick={() => {
				$activeMenus.setKey('userMenu', !activeMenus.userMenu)
				$activeMenus.setKey('colourMenu', false)
				$activeMenus.setKey('siteMenu', false)
			}}
			title={`Signed in as ${email}`}
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

function ColourSelectionMenu({ activeMenus, player1Colours, player2Colours, colours, p1c }) {
	//Loading State for playerColours form
	const [loading, setLoading] = useState('Save')
	function handleSubmit(e) {
		e.preventDefault()
		setLoading('Saving...')
		const form = e.target
		const formData = new FormData(form)
		const fetchData = async () => {
			const response = await fetch('/api/player-colours/', {
				method: form.method,
				body: formData
			})
			if (response.ok) {
				setLoading('Saved')
			} else {
				setLoading('Error')
				console.error(response.status)
			}
		}
		fetchData()
		let formObject = Object.fromEntries(formData.entries())
		let p1 = JSON.parse(formObject.player_1_colours)
		let p2 = JSON.parse(formObject.player_2_colours)
		$player1Colours.setKey('colour_name', p1.name)
		$player1Colours.setKey('colour_id', p1.id)
		$player2Colours.setKey('colour_name', p2.name)
		$player2Colours.setKey('colour_id', p2.id)
	}
	return (
		<>
			<div
				className={`${
					activeMenus.colourMenu ? '' : 'hidden'
				} user-menu colour-menu absolute right-40 top-[--header-height] rounded-[--border-radius] border-2 border-solid border-light-grey bg-white p-4 shadow-lg`}
			>
				<form className="flex flex-col space-y-4" onSubmit={handleSubmit} method="post">
					<PlayerColourSelection
						playerNumber="1"
						playerProps={player1Colours}
						colours={colours}
						setLoading={setLoading}
					/>
					<PlayerColourSelection
						playerNumber="2"
						playerProps={player2Colours}
						colours={colours}
						setLoading={setLoading}
					/>
					<button
						type="submit"
						className={`min-w-24 rounded-[--border-radius] border-[2px] border-solid border-light-red bg-white px-2.5 py-1 text-center text-[length:--font-size-h4] font-medium leading-[--line-height-h4] text-light-red no-underline hover:bg-light-red hover:text-white`}
					>
						{loading}
					</button>
				</form>
			</div>
		</>
	)
}

function PlayerColourSelection({ playerNumber, playerProps, colours, setLoading }) {
	const [colourProps, setColourProps] = useState({
		id: playerProps.colour_id,
		name: playerProps.colour_name,
		player_id: playerProps.id
	})
	useEffect(() => {
		setColourProps({
			id: playerProps.colour_id,
			name: playerProps.colour_name
		})
	}, [playerProps])
	return (
		<>
			<label className="flex flex-col font-bold text-dark-grey">
				<span className="mb-0.5 ml-1.5">Player {playerNumber}</span>
				<select
					name={`player_${playerNumber}_colours`}
					value={`{"player_id":"${playerProps.id}", "name":"${colourProps.name}", "id":"${colourProps.id}"}`}
					onChange={(e) => {
						let colour = JSON.parse(e.target.value).name
						let id = JSON.parse(e.target.value).id
						let nextProps = { id: id, name: colour }
						setColourProps(nextProps)
						setLoading('Save')
					}}
					id={`player-${playerNumber}-colours`}
					className="rounded rounded-[--border-radius] px-2.5 py-1 font-normal"
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
			</label>
			<div className="!mt-2.5 flex items-start justify-center gap-2">
				<div
					className={`player-${playerNumber}-preview-light bg-light-${colourProps.name} h-8 w-8`}
				></div>
				<div
					className={`player-${playerNumber}-preview-dark bg-dark-${colourProps.name} h-8 w-8`}
				></div>
			</div>
		</>
	)
}
