export declare type Coord = {
    x: number;
    y: number;
};
export declare enum Colour {
    White = "White",
    Black = "Black"
}
export declare enum Name {
    King = "King",
    Queen = "Queen",
    Bishop = "Bishop",
    Knight = "Knight",
    Castle = "Castle",
    Pawn = "Pawn"
}
export declare type Piece = {
    pos: Coord;
    colour: Colour;
    name: Name;
    id: string;
};
