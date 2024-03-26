import { useState } from 'react'

function Circle({ value }) {
	return <div className={`circle ${value}`}></div>
}

function Board({ circles }) {
	return (
		<div className="board">
			{[0, 6, 12, 18, 24, 30, 36].map(function (i) {
				return (
					<div className="board-column">
						{[i, i + 1, i + 2, i + 3, i + 4, i + 5].map((x) => (
							<Circle value={circles[x]} key={'c' + x} />
						))}
					</div>
				)
			})}
		</div>
	)
}

function Input({ onInputClick }) {
	return (
		<button className="input" onClick={onInputClick}>
			&darr;
		</button>
	)
}

export default function Game() {
	const [circles, setCircles] = useState(Array(42).fill(null))
	const [blueIsNext, setBlueIsNext] = useState(true)
	let gameStatus = 'Next Player: ' + (blueIsNext ? 'Blue' : 'Green')
	const thisWinner = calculateThisWinner(circles)
	thisWinner ? (gameStatus = `Winner: ${thisWinner}`) : null
	console.log(thisWinner)

	function onPlay(i) {
		if (thisWinner) {
			return
		} else {
			setBlueIsNext(!blueIsNext)
			let nextCircles = [...circles]
			for (let x = i + 5; x >= i; x--) {
				if (nextCircles[x]) {
					null
				} else {
					nextCircles[x] = blueIsNext ? 'blue' : 'green'
					setCircles(nextCircles)
					return
				}
			}
		}
	}
	function resetGame() {
		setCircles(Array(42).fill(null))
	}

	return (
		<>
			<div className="fiar">
				<div className="flex-row">
					<h2>Four in a Row</h2>
					<button className="reset" onClick={resetGame}>
						Reset Game
					</button>
				</div>
				<div className="wrapper">
					<div className="status">{gameStatus}</div>
					<div className="inputWrapper">
						{[0, 6, 12, 18, 24, 30, 36].map((i) => (
							<Input key={'i' + i} onInputClick={() => onPlay(i)} />
						))}
					</div>
					<div>
						<Board circles={circles}></Board>
					</div>
				</div>
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
	for (let i = 0; i < possibleWins.length; i++) {
		let [a, b, c, d] = possibleWins[i]
		console.log(a)
		if (
			circles[a] &&
			circles[a] === circles[b] &&
			circles[a] === circles[c] &&
			circles[a] === circles[d]
		) {
			console.log('win')
			return circles[a]
		} else if (
			circles[a + 1] &&
			circles[a + 1] === circles[b + 1] &&
			circles[a + 1] === circles[c + 1] &&
			circles[a + 1] === circles[d + 1]
		) {
			console.log('win')
			return circles[a + 1]
		} else if (
			circles[a + 2] &&
			circles[a + 2] === circles[b + 2] &&
			circles[a + 2] === circles[c + 2] &&
			circles[a + 2] === circles[d + 2]
		) {
			console.log('win')
			return circles[a + 2]
		}
	}
	return null
}
