import "./board-component.css";
import { Colour, Move } from '../board/internal-board.type';
import { nameToUnicode } from "../board/ui-board";

const squareSize = 56;
const fontSize = 16;


const moveToTextID = (move:Move, moveNumber:number) => `${moveNumber}: ${move.info} {${move.from.x},${move.from.y}} \u265C {${move.to.x},${move.to.y}}`

const xToLetter = (x:number) => {switch(x) {
  case 0:
    return 'a';
  case 1:
    return 'b';
  case 2:
    return 'c';
  case 3:
    return 'd';
  case 4:
    return 'e';
  case 5:
    return 'f';
  case 6:
    return 'g';
  case 7:
    return 'h';
  default:
    return 'Error';
}
}


const moveToText = (move:Move) => `${nameToUnicode(move.info as string)} ${xToLetter(move.from.x)}${move.from.y+1}\u2192${xToLetter(move.to.x)}${move.to.y+1}`

const showHistory = (history:Move[]) => {

  console.log('history:', history);
    
  return history.map( (move,index) => {
      const moveName = moveToTextID(move,index);
      const moveText = moveToText(move)
      const offset = index % 2 === 0 ? 0: 80;
      const row = Math.floor(index / 2);
      const colour = offset === 0 ? Colour.White : Colour.Black;
      return <text
      className="draggable"
      fontSize={fontSize}
      fontFamily="Courier"
      id={moveName}
      key={moveName}
      //stroke={colour === Colour.White ? "black" : "lightgrey"}
      fill={colour === Colour.White ? "white" : "black"}
      x={fontSize + offset}
      y={fontSize*2 + fontSize*row}
      // stroke={piece.colour === Colour.White ? "black" : "lightgrey"}
      // fill={piece.colour === Colour.White ? "white" : "black"}
    >
      {moveText}
    </text>});
};


type HistoryProps = {
  history: Move[];
}
  
export function MoveHistoryComponent({history}:HistoryProps) {
    return <>
        <svg width={squareSize * 3} height={squareSize * 8}>
        <rect
          key={`history-123`}
          x={4}
          y={0}
          width={squareSize*3}
          height={squareSize * 8}
          style={{
            fill: "lightsteelblue",
          }}
        />

        <text
      className="White title"
      fontSize={fontSize}
      id="white history title"
      key="white history title"
      x={fontSize *2}
      y={fontSize}
      fill="white"
      // stroke={piece.colour === Colour.White ? "black" : "lightgrey"}
      // fill={piece.colour === Colour.White ? "white" : "black"}
    >
      White
    </text>

    <text
      className="Black title"
      fontSize={fontSize}
      id="Black history title"
      key="Black history title"
      x={fontSize*2 + 80}
      y={fontSize}
      // stroke={piece.colour === Colour.White ? "black" : "lightgrey"}
      // fill={piece.colour === Colour.White ? "white" : "black"}
    >
      Black
    </text>

          {showHistory(history)}
        </svg>
      </>;
}

