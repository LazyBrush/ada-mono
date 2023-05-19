import "./board-component.css";
import { GameControllerClass } from "../board/game-controller-class";

const squareSize = 56;
const fontSize = 16;

type InfoProps = {
  gc: GameControllerClass;
}
  
export function InfoComponent({gc}:InfoProps) {
    return <>
        <svg width={squareSize * 3} height={squareSize * 8}>
        <rect
          key={`info-123`}
          x={0}
          y={0}
          width={squareSize*3 - 4}
          height={squareSize * 8}
          style={{
            fill: "lightsteelblue",
          }}
        />

    <text
      className="Info Line"
      fontSize={fontSize}
      id="Info Line"
      key="Info Line"
      x={fontSize}
      y={fontSize +4}
      fill="black"
    >
      {gc.getInfoLine()}
    </text>

      <text
      className="Whos Turn"
      fontSize={fontSize}
      id="Whos Turn"
      key="Whos Turn"
      x={fontSize}
      y={fontSize * 3 +4}
      fill="black"
    >
      {gc.whosTurnIsIt()}'s Turn
    </text>



        </svg>
      </>;
}

