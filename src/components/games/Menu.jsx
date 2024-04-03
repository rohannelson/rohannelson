import { useEffect } from 'react'
import { $player1wins, $player2wins } from '../../stores/playerWins'
import { useStore } from '@nanostores/react'

export default function Menu({ resetGame, game }) {
	const player1wins = useStore($player1wins)
	const player2wins = useStore($player2wins)
	const fetchWins = async () => {
		const response = await fetch(`/api/player-wins/`)
		const data = await response.json()
		console.log('player wins', data)
		$player1wins.set(data.player_1_wins)
		$player2wins.set(data.player_2_wins)
	}
	useEffect(() => {
		fetchWins()
	}, [])
	useEffect(() => {
		$player1wins.subscribe((current, old, changed) => {
			if (changed) {
				const body = JSON.stringify({ current, changed })
				fetch('/api/player-wins', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: body
				})
			}
		})
		$player2wins.subscribe((current, old, changed) => {
			if (changed) {
				const body = JSON.stringify({ current, changed })
				fetch('/api/player-wins', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: body
				})
			}
		})
	}, [])

	function Scores() {
		return (
			<dl className="flex w-fit grow-0 items-center space-x-4 self-start rounded-[--border-radius] md:mx-auto md:mb-4 md:mt-1">
				<h2 className="-mr-2 mb-auto text-lg">Score:</h2>
				<div className="flex items-center space-x-1">
					<dd className="text-sm">Player 1:</dd>
					<dt className="font-bold">{player1wins[game]}</dt>
				</div>
				<div className="flex items-center space-x-1">
					<dd className="text-sm">Player 2:</dd>
					<dt className="font-bold">{player2wins[game]}</dt>
				</div>
			</dl>
		)
	}

	return (
		<>
			<div className="flex items-end md:-mt-3.5 md:mb-3">
				<button
					className="mr-auto rounded-[--border-radius] border-[3px] border-solid border-light-red bg-white p-2 font-bold text-light-red hover:cursor-pointer hover:bg-light-red hover:text-white md:p-1.5"
					onClick={resetGame}
				>
					Reset Game
				</button>
				<div className="mb-auto md:hidden">
					<Scores />
				</div>
				<a
					href="/projects/games"
					className="ml-auto inline-block rounded-[--border-radius] border-[3px] border-solid border-light-red bg-white p-2 font-bold text-light-red hover:cursor-pointer hover:bg-light-red hover:text-white md:p-1.5"
				>
					Other Games
				</a>
			</div>
			<div className="flex hidden w-full items-center justify-center md:inline-block">
				<Scores />
			</div>
		</>
	)
}
