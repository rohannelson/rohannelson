import { useState } from 'react'
import { player1Colours, player2Colours } from '../../stores/playerColours'
import { useStore } from '@nanostores/react'
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks'

function Square({ value, onSquareClick, p1c, p2c, winner, i, xIsNext }) {
	/*props from Board:

  value=squares[x] (where squares is an array of 9 values)
  
  onSquareClick=handleClick(x) (where handleClick checks for a winner, checks if the square is empty, and then assigns the appropriate value to the square based on xIsNext)*/

	let staticColour = value == 'X' ? 'text-light-' + p1c : 'text-light-' + p2c
	let nextPiece = xIsNext ? 'X' : 'O'
	//Had to use a hack to get Tailwind to include the hoverContent classes - see the Game component.
	let hoverContent = !value && `hover:after:content-['${nextPiece}']`
	let hoverColour = xIsNext ? 'hover:after:text-light-' + p1c : 'hover:after:text-light-' + p2c
	let winningColour = value == 'X' ? p1c : p2c
	let winningStyles = winner?.includes(i) ? `bg-light-${winningColour} text-white` : 'bg-white'
	return (
		<button
			className={`square flex h-24 w-24 items-center justify-center p-0 text-center text-6xl font-bold leading-8 hover:after:text-opacity-50 md:h-14 md:w-14 md:text-4xl ${winningStyles} ${staticColour} ${hoverContent} ${hoverColour}`}
			onClick={onSquareClick}
		>
			{value}
		</button>
	)
}

function Board({ xIsNext, squares, onPlay, p1c, p2c }) {
	/*props from Game:
  
      xIsNext = currentMove % 2 === 0;
      
      squares = currentSquares = history[currentMove] (where history is an array of each state of the board.)
      
      onPlay = handlePlay(nextSquares) {
          Adds new set of squares to nextHistory
          Changes current move to nextHistory.length - 1
          currently sets movesArray... not so sure about this.
      }
      */

	function handleClick(i) {
		if (calculateWinner(squares) || squares[i]) {
			return
		}
		const nextSquares = squares.slice()
		if (xIsNext) {
			nextSquares[i] = 'X'
		} else {
			nextSquares[i] = 'O'
		}
		onPlay(nextSquares)
	}

	function calculateWinner(squares) {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		]
		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i]
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return lines[i]
			}
		}
		return null
	}

	const winner = calculateWinner(squares)

	let colour = xIsNext ? 'text-light-' + p1c : 'text-light-' + p2c
	let player = xIsNext ? '1' : '2'
	let piece = xIsNext ? 'X' : 'O'
	let status = winner ? `Player ${player == 1 ? 2 : 1} Wins!` : `Player ${player}'s Turn`

	return (
		<>
			<div className="status mb-4 self-center text-dark-grey">
				<span className="text-xl font-bold md:text-base">{status}</span>
				{!winner && (
					<span>
						&nbsp;(<span className={`${colour} text-2xl font-bold md:text-xl`}>{piece}</span>)
					</span>
				)}
				{
					//To prevent layout-shift on winning
					winner && <span className="text-2xl md:text-xl">&nbsp;</span>
				}
			</div>
			<div className="grid grid-cols-3 gap-[5px] overflow-hidden rounded-[--border-radius] [background:radial-gradient(var(--light-grey)_70%,white_100%)]">
				{[0, 3, 6].map(function (i) {
					return [i, i + 1, i + 2].map((x) => (
						<Square
							value={squares[x]}
							onSquareClick={() => handleClick(x)}
							key={x}
							p1c={p1c}
							p2c={p2c}
							winner={winner}
							i={x}
							xIsNext={xIsNext}
						/>
					))
				})}
			</div>
			{winner && <Fireworks autorun={{ speed: 2, duration: 1500 }} />}
		</>
	)
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)])
	const [currentMove, setCurrentMove] = useState(0)
	const xIsNext = currentMove % 2 === 0
	const currentSquares = history[currentMove]
	const movesInit = history.map((squares, move) => {
		return <li key={move}>You are at move# {move}</li>
	})
	const [moves, setMoves] = useState(movesInit)
	const [reversed, setReversed] = useState(false)
	const $player1Colours = useStore(player1Colours)
	const $player2Colours = useStore(player2Colours)
	const p1c = $player1Colours?.colour_name ?? 'red'
	const p2c = $player2Colours?.colour_name ?? 'green'

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
		const newMoves = nextHistory.map((squares, move) => {})
		if (reversed === true) {
			newMoves.reverse()
		}
		setMoves(newMoves)
	}
	function resetGame() {
		console.log('Reset')
		setCurrentMove(0)
	}

	return (
		<div className="tictactoe">
			<div className="flex items-end">
				<h2 className="mt-3">TicTacToe</h2>
				<button
					className="reset ml-auto rounded-[--border-radius] border-[3px] border-solid border-light-red bg-white p-2 font-bold text-light-red hover:cursor-pointer hover:bg-light-red hover:text-white"
					onClick={resetGame}
				>
					Reset Game
				</button>
			</div>
			<div className="game wrapper flex flex-row flex-col items-center justify-center">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} p1c={p1c} p2c={p2c} />
			</div>
			<div className="tailwind-hack h-0 w-0 hover:after:content-['O'] hover:after:content-['X']"></div>
		</div>
	)
}
