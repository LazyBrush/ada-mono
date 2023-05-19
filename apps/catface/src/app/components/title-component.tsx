import "./board-component.css";

const squareSize = 56;
  
export function TitleComponent() {
    return <>

<svg width={squareSize*10} height={squareSize}>
        <rect
          key={`title-123`}
          x={squareSize}
          y={0}
          width={squareSize*8}
          height={squareSize}
          style={{
            fill: "lightsteelblue",
          }}
          onClick={() => {
            console.log("click on board");
          }}
        />
        <text x={squareSize*2} y="35" className="small">{`🧠`}Mind{`👺`}Goblin{`♟️`}Chess{`🐵`}</text>
      </svg>
      </>;
}

