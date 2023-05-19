import { Board, Colour, Move } from './internal-board.type';

export type BoardTreeNode = {
    board: Board;
    whosTurn: Colour;
    moveToGetHere: Move | undefined;
    evaluation: number[];
    next: BoardTreeNode[] | undefined;
    minimaxValue?: number;
}

// ^^^^ perhaps add 'in check' flag to this type

// funcs 
// Board and Colour get all possible moves