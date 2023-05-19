import { BoardBasicClass } from "./board-basic-class";
import { Board, Coord, Move, Name, Square } from "./internal-board.type";
import { MovesClass } from "./moves-class";

export const boardInit = ():Board => {
    const bbc = new BoardBasicClass();
    return bbc.getBoard();
}

export const boardIndexAtCoord = (pos:Coord):number => pos.y * 8 + pos.x;

export const boardPieceAt = (board:Board, pos:Coord):Square => {
    const index = boardIndexAtCoord(pos);
    return board[index];
}

export const boardIsPieceAt = (board:Board, pos:Coord):boolean => {
    const piece = boardPieceAt(board, pos);
    if (piece) {
        return true
    } else {
        return false
    }
}

export const boardMovePiece = (board:Board, move:Move):Board => {
    const moves = new MovesClass();
    const oldpiece = boardPieceAt(board, move.from);
    const oldindex = boardIndexAtCoord(move.from);
    if (!oldpiece) {
        return board;
    }
    // console.log('Move is ', move);
    const name = moves.isThisMoveAPawnPromotion(oldpiece) ? Name.Queen : oldpiece.name;
    const newpiece = { ...oldpiece, pos: move.to, name};
    const newindex = boardIndexAtCoord(move.to);
    // console.log('Piece moved to ', newpiece);
    const newboard = Array.from(board);
    newboard[newindex] = newpiece as Square;
    newboard[oldindex] = undefined;
    return newboard;
}