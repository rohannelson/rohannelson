import React from "react";
import { useState } from "react";
import { capitalise } from '../../components/utils';

function CheckerSquare({className, value, onSquareClick}) {
    return (<button onClick={onSquareClick} className={`square ${className}`}>
        {value}
    </button>)
}

function Black({king}) {
    return <div className={`blackChecker ${king}`}></div>
}

function White({king}) {
    return <div className={`whiteChecker ${king}`}></div>
}

function CheckerRow({iRow, squares, onSquareClick}) {
    const checkerRow = [0,1,2,3,4,5,6,7].map((iSquare) => {
        let classname = "black";
        let offset;
        iRow % 2 === 0 ? offset = 0 : offset = 1;
        if (iSquare % 2 === offset) {classname="white"}
        let keyValue = iRow*8 + iSquare
        let valueValue;
        if (squares[keyValue] === "black") {valueValue = <Black king=""/>}
        if (squares[keyValue] === "white") {valueValue = <White king=""/>}
        if (squares[keyValue] === "blackKing") {valueValue = <Black king="blackCheckerKing"/>}
        if (squares[keyValue] === "whiteKing") {valueValue = <White king="whiteCheckerKing"/>}
        return (<CheckerSquare className={classname} value={valueValue} key={keyValue} onSquareClick={() => onSquareClick(squares[keyValue], keyValue, offset)}/>)

})
    return (<div className="board-row">{checkerRow}</div>)
}

function CheckerBoard({squares, onSquareClick}) {
    const checkerBoard = [0,1,2,3,4,5,6,7].map((iRow) =><CheckerRow iRow={iRow} squares={squares} onSquareClick={onSquareClick}/>)
    return (checkerBoard)
}

export default function Game() {
    const initialSquares = Array(64).fill("");
    [1,3,5,7,8,10,12,14].forEach((i) => initialSquares[i] = "black");
    [49,51,53,55,56,58,60,62].forEach((i) => initialSquares[i] = "white");
    const [squares, setSquares] = useState(initialSquares);
    const [held, setHeld] = useState(false);
    const [blacksTurn, setBlacksTurn] = useState(true);
    const [offensive, setOffensive] = useState(false);
    let turn;
    blacksTurn ? turn = "black" : turn = "white";
    let notTurn;
    blacksTurn ? notTurn = "white" : notTurn = "black";
    let turnToken;
    blacksTurn ? turnToken = 1 : turnToken = -1;

    function handleClick(value, index, offset) {
        let diagonalA;
        let diagonalB;
        let reverseDiagonalA;
        let reverseDiagonalB
        let longDiagonalA;
        let longDiagonalB;
        let reverseLongDiagonalA;
        let reverseLongDiagonalB;
        //checks for possible offensive moves
        function offensiveCheck() {
            let possibleOffensiveMoves = []
            squares.forEach((square, i) => {
                if (square.includes(turn)) {
                let possibleDiagonalA = i + 7 * turnToken
                let possibleDiagonalB = i + 9 * turnToken
                let possibleReverseDiagonalA = i + 7 * turnToken * -1
                let possibleReverseDiagonalB = i + 9 * turnToken * -1
                let possibleLongDiagonalA = i + 14 * turnToken
                let possibleLongDiagonalB = i + 18 * turnToken
                let possibleReverseLongDiagonalA = i + 14 * turnToken * -1
                let possibleReverseLongDiagonalB = i + 18 * turnToken * -1
                function legitTest(suspect, moveType) {
                    if (turn.includes("white") && moveType === "A" && suspect % 8 > i % 8
                    || turn.includes("white") && moveType === "B" && suspect % 8 < i % 8
                    || turn.includes("black") && moveType === "A" && suspect % 8 < i % 8
                    || turn.includes("black") && moveType === "B" && suspect % 8 > i % 8) {
                        console.log("legit")
                        return true
                } else {
                    console.log("not legit")
                    return false
                }
            }
                if (squares[possibleLongDiagonalA] === "" && squares[possibleDiagonalA]?.includes(notTurn) && legitTest(possibleLongDiagonalA, "A") && validate(possibleLongDiagonalA)) {
                    console.log(`PLDA true ${i} to ${possibleLongDiagonalA}`);
                    possibleOffensiveMoves.push(i)
            }
                if (squares[possibleLongDiagonalB] === "" && squares[possibleDiagonalB]?.includes(notTurn) && legitTest(possibleLongDiagonalB, "B") && validate(possibleLongDiagonalB)) {
                    console.log(`PLDB true ${i} to ${possibleLongDiagonalB}`)
                    possibleOffensiveMoves.push(i)
                }
                if (square?.includes("King") && squares[possibleReverseLongDiagonalA] === "" && squares[possibleReverseDiagonalA]?.includes(notTurn) && legitTest(possibleReverseLongDiagonalA, "B") && validate(possibleReverseLongDiagonalA)) {
                    console.log(`PRLDA true ${i} to ${possibleReverseDiagonalA}`)
                    possibleOffensiveMoves.push(i)
                }
                if (square?.includes("King") && squares[possibleReverseLongDiagonalB] === "" && squares[possibleReverseDiagonalB]?.includes(notTurn) && legitTest(possibleReverseLongDiagonalB, "A") && validate(possibleReverseLongDiagonalB)) {
                    console.log(`PRLDB true ${i} to ${possibleReverseLongDiagonalB}`)
                    possibleOffensiveMoves.push(i)
                }
                }
            })
            console.log(possibleOffensiveMoves)
            if (possibleOffensiveMoves[0]) {setOffensive(true)}
            return possibleOffensiveMoves;
        }
        offensiveCheck()[0] ? console.log("true") : console.log("false")
        if (value?.includes(notTurn)) {
            return
        } //pickup piece 
        else if (!offensiveCheck()[0] && !held && value?.includes(turn)
        || offensiveCheck().includes(index) && !held) {
            console.log(`pickup ${value}`)
            let nextSquares = [...squares]
            nextSquares[index] = ""
            setSquares(nextSquares);
            setHeld({value, index, offset});
            return
        } else if (held && index === held.index) {
            console.log(`return ${value}`)
            let nextSquares = [...squares]
            nextSquares[index] = held?.value
            setSquares(nextSquares);
            setHeld(false);
        } else if (held) {
            diagonalA = held.index + 7 * turnToken
            diagonalB = held.index + 9 * turnToken
            reverseDiagonalA = held.index + 7 * turnToken * -1
            reverseDiagonalB = held.index + 9 * turnToken * -1
            longDiagonalA = held.index + 14 * turnToken
            longDiagonalB = held.index + 18 * turnToken
            reverseLongDiagonalA = held.index + 14 * turnToken * -1
            reverseLongDiagonalB = held.index + 18 * turnToken * -1
        }
        function validate(num) {
            if (num > 0 && num < 63) {return true} else {return false}
        }
        function kingCheck() {
            if (held?.value === ("white") && index < 8 
            || held?.value === ("black") && index > 55) {
                return `${held?.value}King`} else {return held?.value}
        }
        //If it's a valid basic move
        if (held && value === "" && index === diagonalA && held[2] !== offset && !offensive
        || held && value === "" && index === diagonalB && held[2] !== offset && !offensive
        || held?.value?.includes("King") && value === "" && index === reverseDiagonalA && held[2] !== offset && !offensive
        || held?.value?.includes("King") && value === "" && index === reverseDiagonalB && held[2] !== offset && !offensive) {
            console.log("basic move")
            let nextSquares = [...squares]
            nextSquares[index] = kingCheck()
            setSquares(nextSquares)
            setHeld(false)
            setBlacksTurn(!blacksTurn)
            return
        //if it's a valid offensive move
        } else if (value === "" && index === (longDiagonalB) && squares[diagonalB]?.includes(notTurn) && held.offset === offset
            || value === "" && index === (longDiagonalA) && squares[diagonalA]?.includes(notTurn) && held.offset === offset
            || value === "" && index === (reverseLongDiagonalB) && squares[reverseDiagonalB]?.includes(notTurn) && held.offset === offset
            || value === "" && index === (reverseLongDiagonalA) && squares[reverseDiagonalA]?.includes(notTurn) && held.offset === offset) {
                console.log("offensive move")
                let takenPiece;
                if (index === longDiagonalB) {
                    takenPiece = diagonalB
                } else if (index === longDiagonalA) {
                    takenPiece = diagonalA
                } else if (index === reverseLongDiagonalA) {
                    takenPiece = reverseDiagonalA
                } else if (index === reverseLongDiagonalB) {
                    takenPiece = reverseDiagonalB
                }
                let nextSquares = [...squares]
                nextSquares[index] = kingCheck()
                nextSquares[takenPiece] = "";
                nextSquares[held.index] = "";
                setSquares(nextSquares);
                //setup to check for subsequent offensive moves
                let newDiagonalA = index + 7 * turnToken
                let newDiagonalB = index + 9 * turnToken
                let newReverseDiagonalA = index + 7 * turnToken * -1
                let newReverseDiagonalB = index + 9 * turnToken * -1
                let newLongDiagonalA = index + 14 * turnToken
                let newLongDiagonalB = index + 18 * turnToken
                let newReverseLongDiagonalA = index + 14 * turnToken * -1
                let newReverseLongDiagonalB = index + 18 * turnToken * -1
                if (nextSquares[newLongDiagonalA] === "" && nextSquares[newDiagonalA]?.includes(notTurn) && held.offset === offset && validate(newLongDiagonalA)
                || nextSquares[newLongDiagonalB] === "" && nextSquares[newDiagonalB]?.includes(notTurn) && held.offset === offset && validate(newLongDiagonalB)
                || held?.value?.includes("King") && nextSquares[newReverseLongDiagonalA] === "" && nextSquares[newReverseDiagonalA]?.includes(notTurn) && held.offset === offset && validate(newReverseLongDiagonalA)
                || held?.value?.includes("King") && nextSquares[newReverseLongDiagonalB] === "" && nextSquares[newReverseDiagonalB]?.includes(notTurn) && held.offset === offset && validate(newReverseLongDiagonalB)) {
                console.log("another offensive possible")
                let newHeld = {...held}
                newHeld.index=index
                setHeld(newHeld);
                setOffensive(true)
                console.log(newHeld);
                /*nextSquares[newLongDiagonalA] === "" && nextSquares[newDiagonalA]?.includes(notTurn) && held.offset === offset && validate(newLongDiagonalA) ? console.log(`NLDA true ${newLongDiagonalA}`) : console.log(`NLDA false`)
                nextSquares[newLongDiagonalB] === "" && nextSquares[newDiagonalB]?.includes(notTurn) && held.offset === offset && validate(newLongDiagonalB) ? console.log("NLDB true") : console.log("NLDB false");
                held?.value?.includes("King") && nextSquares[newReverseLongDiagonalA] === "" && nextSquares[newReverseDiagonalA]?.includes(notTurn) && held.offset === offset && validate(newReverseLongDiagonalA) ? console.log("NRLDA true") : console.log("NRLDA false");
                held?.value?.includes("King") && nextSquares[newReverseLongDiagonalB] === "" && nextSquares[newReverseDiagonalB]?.includes(notTurn) && held.offset === offset && validate(newReverseLongDiagonalB) ? console.log("NRLDB true") : console.log("NRLDB false");*/
                return
            } else {
                console.log("offensive ended")
                setOffensive(false)
                setHeld(false)
                setBlacksTurn(!blacksTurn)
            }
            console.log(`clicked ${index}`)
        }
    }
    function resetGame() {
        setSquares(initialSquares)
        setBlacksTurn(true)
        setHeld(false)
    }
        //NEED TO INTRODUCE PROMPTS TO INDICATE IF COMPULSORY MOVES ARE POSSIBLE? 


    return (
    <>
    <div className="checkers">
    <div className="flex-row">
    <h2>Checkers</h2>
    <button className="reset" onClick={(resetGame)}>Reset Game</button>
    </div>
    <div className="wrapper">
    <div className="status">{capitalise(turn)}'s turn</div>
    <CheckerBoard squares={squares} onSquareClick={handleClick}/>
    </div>
    </div>
    </>)
}