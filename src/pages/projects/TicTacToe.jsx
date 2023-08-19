import { useState } from 'react';

function Square({ value, onSquareClick }) {
  /*props from Board:

  value=squares[x] (where squares is an array of 9 values)
  
  onSquareClick=handleClick(x) (where handleClick checks for a winner, checks if the square is empty, and then assigns the appropriate value to the square based on xIsNext)*/
  return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  }

  function Board({ xIsNext, squares, onPlay}) {
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
          return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
          nextSquares[i] = 'X';
        } else {
          nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
      }
    
      const winner = calculateWinner(squares);
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
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
            [2, 4, 6],
          ];
          for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
              return squares[a];
            }
          }
          return null;
        }
  
      return (
        <>
          <div className="status">{status}</div>
          {[0,3,6].map(function (i) {
          return (<div className="board-row">
          {[i, i+1, i+2].map(x => <Square value={squares[x]} onSquareClick={() => handleClick(x)} key={x}/>)}
          </div>
          );
        })}
        </>
      );
    }
    

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const movesInit = history.map((squares, move) => {
      return (
        <li key={move}>
          You are at move# {move}
        </li>
      );
    })
    const [moves, setMoves] = useState(movesInit)
    const [reversed, setReversed] = useState(false)

    function handlePlay(nextSquares) {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
      const newMoves = nextHistory.map((squares, move) => {
        let description;
        if (move > 0) {
          description = 'Go to move #' + move;
        } else {
          description = 'Go to game start';
        }
        return (
          <li key={move}>
            {move === nextHistory.length - 1 ? 'You are at move# ' + move : <button onClick={() => jumpTo(move)}>{description}</button>}
          </li>
        );
      })
      if (reversed===true) {newMoves.reverse()}
      setMoves(newMoves)
    }
  
    function jumpTo(nextMove) {
      setCurrentMove(nextMove);
    }
  
    function handleButtonClick() {
      setReversed(!reversed);
      const newMoves=[...moves].reverse();
      setMoves(newMoves);
    }
  
    return (
      <>
      <h2>TicTacToe</h2>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <button onClick={() => handleButtonClick()}>sort in reverse</button>
          <ol>{moves}</ol>
        </div>
      </div>
      </>
    );
  }