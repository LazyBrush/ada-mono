import { useState } from "react";
import "./app.css";

import { Coord, Move, Piece } from "./board/internal-board.type";
import { MovesClass } from "./board/moves-class";
import { BoardComponent } from "./components/board-component";

import { boardPieceAt } from "./board/board-functional";
import { GameControllerClass } from "./board/game-controller-class";
import { EngineClass } from "./board/engine-class";
import { MoveHistoryComponent } from "./components/move-history-component";
import { InfoComponent } from "./components/info-component";
import { TitleComponent } from "./components/title-component";

let count = 0;

const gameController = new GameControllerClass();
const engineClass = new EngineClass();

export enum State {
  SelectPiece = 'SelectPiece',
  SelectTarget = 'SelectTarget'
}
let moveState:State = State.SelectPiece;
let pieceToMove:Piece;

function App() {
  
  const board = gameController.getCurrentBoard();
  const [theBoard, setTheBoard] = useState(board);
  const [theWords, setTheWords] = useState('init');
  const pmoves:Coord[]=[];
  const [possibleMoves, setPossibleMoves] = useState(pmoves);
  const [highlightSquares, setHighlightSquares] = useState(pmoves);
  const [previousMove, setPreviousMove] = useState(pmoves);
  const [history, setHistory] = useState([] as Move[]);

  const robotMove = () => {
    const engineMove = engineClass.engineMinimaxCalcBestMove(gameController.getCurrentBoard(), gameController.whosTurnIsIt());
    console.log('ENGINE MOVE', engineMove);
    gameController.submitMove(engineMove);
    setPreviousMove([engineMove.from,engineMove.to]);
    setHighlightSquares([engineMove.from,engineMove.to]);
    setTheBoard(gameController.getCurrentBoard());
  }
  
  const callback = (coord:Coord) => {
    console.log(`Callback "${moveState}" with ${coord}`);
    const moves = new MovesClass();

    switch (moveState) {
      case State.SelectPiece:
        // piece at this position
        const piece = boardPieceAt(theBoard, coord) as Piece;

        if (piece.colour !== gameController.whosTurnIsIt()) {
          console.log('Not your turn');
          return;
        }

        // get pseudo moves for this piece
        // same as below vvvvv
        //const pseudo = moves.pseudoLegalCoordsForPiece(piece, theBoard);
        const legalMovesForPiece = engineClass.getAllPossibleLegalMovesForPiece(piece,theBoard);
        const moveCoords = moves.movesToToCoords(legalMovesForPiece);
        setPossibleMoves(moveCoords);

        // words change
        if (piece) {
          console.log('Piece id ', piece.id);
          count = count +1;
          setTheWords(`move ${count} ${piece?.id}`);
        } else {
          console.log('No piece at ', coord);
        }
        pieceToMove = piece;
        moveState = State.SelectTarget;
        setHighlightSquares(previousMove.concat(piece.pos));
        // same as below ^^^^^
        break;

      case State.SelectTarget:

        const move:Move = {
          from: pieceToMove.pos,
          to: coord
        }
        if (gameController.isValidMove(move)) {

          gameController.submitMove(move);

          setTheBoard(gameController.getCurrentBoard());
          
          setTheWords(`target ${coord} chosen`);
          moveState = State.SelectPiece;
          setPossibleMoves([]);

          setPreviousMove([move.from,move.to]);
          setHighlightSquares([move.from,move.to]);

          setHistory(gameController.getHistory());

          // Do the engine move after a short delay
          // which lets the human move be shown/displayed
          setTimeout( robotMove, 10);
        } else {

          const piece = boardPieceAt(theBoard, coord);
          if (piece && piece.colour === pieceToMove.colour) {

            console.log('Unslecting');
            setPossibleMoves([]);
            setHighlightSquares([]);
            moveState = State.SelectPiece;

            // messy, move to function
            // see vvvvv above
            const legalMovesForPiece = engineClass.getAllPossibleLegalMovesForPiece(piece,theBoard);
            const moveCoords = moves.movesToToCoords(legalMovesForPiece);
            setPossibleMoves(moveCoords);
            // const pseudo = moves.pseudoLegalCoordsForPiece(piece, theBoard);
            // setPossibleMoves(pseudo);
            // words change
            if (piece) {
              console.log('Piece id ', piece.id);
              count = count +1;
              setTheWords(`move ${count} ${piece?.id}`);
            } else {
              console.log('No piece at ', coord);
            }
            pieceToMove = piece;
            moveState = State.SelectTarget;
            setHighlightSquares(previousMove.concat(piece.pos));
            // see ^^^^ above
          }
        }
        break;

      default:
    }
        
    console.log('Callback: theBoard updated');
  }

  return (
    <div className="App">
      <div>
        <svg width={10} height={10} className="SeparatorShouldBeDoneWithCSSReally"></svg>
      </div>
      <div>
      <TitleComponent></TitleComponent>
      </div>
      <div>
      <InfoComponent gc={gameController}></InfoComponent>
      <BoardComponent board={theBoard} callback={callback} words={theWords} possibleMoves={possibleMoves} highlightSquares={highlightSquares}></BoardComponent>
      <MoveHistoryComponent history={history}></MoveHistoryComponent>
      </div>
    </div>
  );
}

export default App;
