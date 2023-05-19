import "./board-component.css";
import { Board, Colour, Coord, Piece } from '../board/internal-board.type';
import { drawBoardBackground, pieceNameToUnicode } from "../board/ui-board";

const squareSize = 56;
const nudge = Math.floor(squareSize * 0.15);
const fontSize = squareSize + nudge;

const showBoardPieces = (board:Board, callback:(coord:Coord)=>void) => {

    const pieces = board.filter( (e) => e !== undefined ) as Piece[];

    return pieces.map( (piece) => {
      return <text
      className="draggable"
      fontSize={fontSize}
      id={piece.id}
      key={piece.id}
      x={piece.pos.x * squareSize + nudge}
      y={(7 - piece.pos.y) * squareSize + squareSize - nudge}
      stroke={piece.colour === Colour.White ? "black" : "lightgrey"}
      fill={piece.colour === Colour.White ? "white" : "black"}
      onClick={(e) => {
        callback(piece.pos);
      }
    }
    >
      {pieceNameToUnicode(piece)}
    </text>});
};

const showPossibleMoves = (decorate:Coord[], callback:(coord:Coord)=>void) => {
  return decorate.map( (coord) => {
    return <circle
        key={`circle-${coord.x}-${coord.y}`}
        cx={coord.x * squareSize + squareSize/2}
        cy={(7 - coord.y) * squareSize + squareSize/2}
        r={squareSize/5}
        fill="yellow"
        opacity="0.5"
        onClick={(e) => {
          callback(coord);
        }}
      />;
  })
}

const showHighlightedSquares = (decorate:Coord[]) => {
  return decorate.map( (coord) => {
    return <rect
    key={`highlight-square-${coord.x}-${coord.y}`}
    x={coord.x * squareSize}
    y={(7-coord.y) * squareSize}
    width={squareSize}
    height={squareSize}
    style={{
      fill: "yellow",
      opacity: "0.2"
    }}
    />;
  })
}

type BoardComponentProps = {
  board: Board;
  callback: (parms:any) => void;
  words: string;
  possibleMoves: Coord[];
  highlightSquares: Coord[];
}
  
export function BoardComponent({board,callback,words,possibleMoves,highlightSquares}:BoardComponentProps) {
    return <>
        <svg width={squareSize * 8} height={squareSize * 8}>
          {drawBoardBackground(squareSize)}
          {showHighlightedSquares(highlightSquares)}
          {showBoardPieces(board, callback)}
          {showPossibleMoves(possibleMoves, callback)}
        </svg>
      </>;
}
