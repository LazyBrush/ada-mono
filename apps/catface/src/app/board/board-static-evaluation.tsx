import { EngineClass } from "./engine-class";
import { Board, Colour, Name, Piece } from "./internal-board.type";

const values = {
    King: 1000,
    Queen: 10,
    Bishop: 4,
    Knight: 3,
    Castle: 5,
    Pawn: 1
};

const pieceValue = (piece:Piece):number => {
    return values[Name[piece.name]];
}

export const boardEvaluationSimpleCountPieces = (board:Board, colour:Colour):number => {
    const engine = new EngineClass();
    const pieces = engine.getAllPiecesForColour(board, colour);
    const reducerFunc = (prev:number, current:number) => prev + current;
    return pieces
        .map( (piece) => pieceValue(piece))
        .reduce(reducerFunc);
}

export const boardEvaluationSimpleSquaresThreatening = (board:Board, colour:Colour):number => {
    const engine = new EngineClass();
    const moves = engine.getAllPossibleMoves(board, colour);
    return moves.length / 10;
}