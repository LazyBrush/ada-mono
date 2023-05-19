import { Name, Piece } from './internal-board.type';

const king = `\u265A`;
const queen = `\u265B`;
const castle = `\u265C`;
const bishop = `\u265D`;
const knight = `\u265E`;
const pawn = `\u265F`;

const light = "#A8C0CE";
const dark = "#768591";


export const pieceNameToUnicode = (piece:Piece):string => {
  switch (piece.name) {
    case Name.King:
      return king;
    case Name.Queen:
      return queen;
    case Name.Castle:
      return castle;
    case Name.Bishop:
      return bishop;
    case Name.Knight:
      return knight;
    case Name.Pawn:
      return pawn;
    default:
      return "";
  }
}

export const nameToUnicode = (name:string):string => {
  switch (name) {
    case Name.King:
      return king;
    case Name.Queen:
      return queen;
    case Name.Castle:
      return castle;
    case Name.Bishop:
      return bishop;
    case Name.Knight:
      return knight;
    case Name.Pawn:
      return pawn;
    default:
      return "";
  }
}

export const square = (x:number, y:number, len:number, colour:string) => (
  <rect
    key={`square-${x}-${y}`}
    x={x}
    y={y}
    width={len}
    height={len}
    style={{
      fill: colour,
    }}
    onClick={() => {
      console.log("click on board");
    }}
  />
);

export const drawBoardBackground = (slen:number) => {
  const all64 = Array.from(Array(64).keys()); // [0,1,2,3,...,63]
  const col_alt = (n:number):string => (n % 2 === 0 ? light : dark);
  const neg = (c:string):string => (c === light ? dark : light);
  const col = (n:number):string =>
    Math.floor(n / 8) % 2 === 0 ? col_alt(n) : neg(col_alt(n));
  const blah = all64.map((n) => [n % 8, Math.floor(n / 8), col(n)]);
  //console.log(`Blah is ${blah} len ${blah.length}`);
  return <>{blah.map(([x, y, c]) => square(+x * slen, +y * slen, slen, c.toString()))}</>;
};