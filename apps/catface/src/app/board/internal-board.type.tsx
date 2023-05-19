
export type Coord = {
  x: number;
  y: number;
}

export type Move = {
  from: Coord;
  to: Coord;
  info?: string;
}

export enum Colour {
  White = 'White',
  Black = 'Black'
}

export enum Name {
  King = 'King',
  Queen = 'Queen',
  Bishop = 'Bishop',
  Knight = 'Knight',
  Castle = 'Castle',
  Pawn = 'Pawn'
}

export type Piece = {
  pos: Coord;
  colour: Colour;
  name: Name;
  id: string;
}

export type Square = Piece | undefined;

export type Board = Square[];

