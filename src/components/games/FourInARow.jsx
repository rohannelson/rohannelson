import { useState, useEffect, useCallback } from 'react'
import { $player1Colours, $player2Colours } from '../../stores/playerColours'
import { useStore } from '@nanostores/react'
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks'
import Menu from './Menu'
import { $player1wins, $player2wins } from '../../stores/playerWins'

function classList(value, winner, index) {
	const player1Colours = useStore($player1Colours)
	const player2Colours = useStore($player2Colours)
	const p1c = player1Colours?.colour_name ?? 'red'
	const p2c = player2Colours?.colour_name ?? 'green'
	if (winner?.includes(index) && value == 1) {
		return `bg-tint-${p1c} border-white border-2`
	} else if (winner?.includes(index) && value == 2) {
		return `bg-tint-${p2c} border-white border-2`
	} else if (value == 1) {
		return `bg-tint-${p1c} border-light-${p1c}`
	} else if (value == 2) {
		return `bg-tint-${p2c} border-light-${p2c}`
	} else {
		return 'bg-white border-white'
	}
}

function Circle({ value, winner, index }) {
	return (
		<div
			className={`circle my-1 h-8 w-8 rounded-full border border-solid ${classList(
				value,
				winner,
				index
			)}`}
		></div>
	)
}

function Board({ circles, winner }) {
	return (
		<div
			className="board relative m-2 grid
		grid-cols-7 items-center justify-center gap-1 rounded-[--border-radius] bg-gradient-to-t from-dark-grey from-5% to-light-grey p-2 pb-9"
		>
			{[0, 6, 12, 18, 24, 30, 36].map(function (i) {
				return (
					<div className="board-column">
						{[i, i + 1, i + 2, i + 3, i + 4, i + 5].map((x) => (
							<Circle value={circles[x]} winner={winner} index={x} key={'c' + x} />
						))}
					</div>
				)
			})}
			<div className="absolute -left-6 bottom-0 h-7 w-80 rounded-[--border-radius] bg-dark-grey"></div>
		</div>
	)
}

function Input({ onInputClick }) {
	return (
		<button
			className="input color-dark-grey w-8 p-1 font-bold duration-duration hover:translate-y-1"
			onClick={onInputClick}
		>
			&darr;
		</button>
	)
}

export default function Game() {
	const [circles, setCircles] = useState(Array(42).fill(null))
	const [playerOneIsNext, setplayerOneIsNext] = useState(true)
	const thisWinner = calculateThisWinner(circles)
	const player1Colours = useStore($player1Colours)
	const player2Colours = useStore($player2Colours)
	const p1c = player1Colours?.colour_name ?? 'red'
	const p2c = player2Colours?.colour_name ?? 'green'
	const player1wins = useStore($player1wins)
	const player2wins = useStore($player2wins)

	function onPlay(i) {
		if (thisWinner) {
			return
		} else {
			setplayerOneIsNext(!playerOneIsNext)
			let nextCircles = [...circles]
			for (let x = i + 5; x >= i; x--) {
				if (nextCircles[x]) {
					null
				} else {
					nextCircles[x] = playerOneIsNext ? 1 : 2
					setCircles(nextCircles)
					return
				}
			}
		}
	}
	function resetGame() {
		setCircles(Array(42).fill(null))
		setplayerOneIsNext(true)
	}

	let colour = playerOneIsNext ? p1c : p2c
	let player = playerOneIsNext ? '1' : '2'
	let status = thisWinner ? `Player ${player == 1 ? 2 : 1} Wins!` : `Player ${player}'s Turn`
	useEffect(() => {
		if (thisWinner && player == 1) {
			$player2wins.setKey('fiar', player2wins.fiar + 1)
		} else if (thisWinner && player == 2) {
			$player1wins.setKey('fiar', player1wins.fiar + 1)
		}
	}, [player])

	return (
		<>
			<div className="fiar">
				<Menu resetGame={resetGame} game="fiar" />
				<div className="wrapper flex flex-col items-center justify-center">
					<div className="w-72">
						<div className="mb-4 w-full text-center text-dark-grey">
							<span className="text-xl font-bold md:text-base">{status}</span>
							{!thisWinner && (
								<span>
									&nbsp;(
									<div
										className={`bg-tint-${colour} border-light-${colour} relative top-[1.5px] m-[1px] inline-block h-4 w-4 rounded-full border border-solid`}
									></div>
									)
								</span>
							)}
						</div>
						<div className="inputWrapper flex items-center justify-between px-4">
							{[0, 6, 12, 18, 24, 30, 36].map((i) => (
								<Input key={'i' + i} onInputClick={() => onPlay(i)} />
							))}
						</div>
						<div>
							<Board circles={circles} winner={thisWinner}></Board>
						</div>
					</div>
				</div>
				{thisWinner && <Fireworks autorun={{ speed: 2, duration: 1500 }} />}
			</div>
		</>
	)
}

function calculateThisWinner(circles) {
	const possibleWins = [
		//Mapping lowest (numerically) of all options (with middle set for horizontal)
		//Lowest Vertical wins
		[0, 1, 2, 3],
		[6, 7, 8, 9],
		[12, 13, 14, 15],
		[18, 19, 20, 21],
		[24, 25, 26, 27],
		[30, 31, 32, 33],
		[36, 37, 38, 39],
		//Lowest Horizontal wins (top)
		[0, 6, 12, 18],
		[6, 12, 18, 24],
		[12, 18, 24, 30],
		[18, 24, 30, 36],
		//Lowest Horizontal wins (middle)
		[3, 9, 15, 21],
		[9, 15, 21, 27],
		[15, 21, 27, 33],
		[21, 27, 33, 39],
		//Lowest Diagonal wins left-to-right
		[0, 7, 14, 21],
		[6, 13, 20, 27],
		[12, 19, 26, 33],
		[18, 25, 32, 39],
		//Lowest Diagonal wins right-to-left
		[36, 31, 26, 21],
		[30, 25, 20, 15],
		[24, 19, 14, 9],
		[18, 13, 8, 3]
	]
	let wins = []
	for (let i = 0; i < possibleWins.length; i++) {
		let [a, b, c, d] = possibleWins[i]
		if (
			circles[a] &&
			circles[a] === circles[b] &&
			circles[a] === circles[c] &&
			circles[a] === circles[d]
		) {
			console.log('win 0')
			wins.push(possibleWins[i])
		} else if (
			circles[a + 1] &&
			circles[a + 1] === circles[b + 1] &&
			circles[a + 1] === circles[c + 1] &&
			circles[a + 1] === circles[d + 1]
		) {
			console.log('win 1')
			wins.push(possibleWins[i].map((num) => num + 1))
		} else if (
			circles[a + 2] &&
			circles[a + 2] === circles[b + 2] &&
			circles[a + 2] === circles[c + 2] &&
			circles[a + 2] === circles[d + 2]
		) {
			console.log('win 2')
			wins.push(possibleWins[i].map((num) => num + 2))
		}
	}
	if (wins[0]) {
		return wins.flat()
	}
	return null
}
