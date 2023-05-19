import { notDeepEqual } from "assert";
import { isConstructorDeclaration } from "typescript";
import { boardMovePiece } from "./board-functional";
import { boardEvaluationSimpleCountPieces, boardEvaluationSimpleSquaresThreatening } from "./board-static-evaluation";
import { CheckCheckerClass } from "./check-checker-class";
import { BoardTreeNode } from "./engine.type";
import { Board, Colour, Coord, Move, Piece, Square } from "./internal-board.type";
import { MovesClass } from "./moves-class";


export class EngineClass {
    moves = new MovesClass();
    checker = new CheckCheckerClass();
    
    getAllPiecesForColour(board:Board, colour:Colour) {
        return board
            .filter( (square:Square):boolean => square !== undefined)
            .map( (square:Square):Piece => square as Piece)
            .filter( (piece) => piece.colour === colour);
    }

    getAllPossibleMoves(board:Board, colour:Colour):Move[] {
        const pieces = this.getAllPiecesForColour(board, colour);
        return pieces
        .flatMap( (piece):Move[] => this.moves.pseudoLegalMoves(piece, board) );
    }

    getAllPossibleLegalMovesForAllPieces(board:Board, colour:Colour):Move[] {
        const pieces = this.getAllPiecesForColour(board, colour);
        const allPossibleLegalMoves= pieces
            .flatMap( (piece):Move[] => this.getAllPossibleLegalMovesForPiece(piece,board) );
        return allPossibleLegalMoves;
    }

    getAllPossibleLegalMovesForPiece(piece:Piece, board:Board):Move[] {
        const moves = this.moves.pseudoLegalMoves(piece, board);
        const colour = piece.colour;
        const legalMoves = moves.flatMap(
            (move:Move) => {
                const newBoardUsingMove = boardMovePiece(board, move);   
                //const otherColour = colour === Colour.White ? Colour.Black : Colour.White;     
                if (this.checker.isColourInCheck(newBoardUsingMove, colour)) {
                    // console.log('Remove, would put us in check: ', move);
                    return [];
                }
                return [move];
            }
        )
        return legalMoves;
    }


    getAllPossibleBoards(board:Board, colour:Colour):Board[] {
        const allMoves = this.getAllPossibleMoves(board,colour);

        return allMoves
            .map( (move) => {
                return boardMovePiece(board, move);
            })
    }

    expandTreeNode(node:BoardTreeNode):BoardTreeNode {
        if (node.next === undefined) {
            const allMoves = this.getAllPossibleLegalMovesForAllPieces(node.board, node.whosTurn);
            node.next = allMoves.map( (move):BoardTreeNode => {
                const newBoard = boardMovePiece(node.board, move);
                const whosTurn = node.whosTurn === Colour.White ? Colour.Black : Colour.White;
                const evaluation = [
                    boardEvaluationSimpleCountPieces(newBoard, node.whosTurn) 
                     - boardEvaluationSimpleCountPieces(newBoard, whosTurn),
                    boardEvaluationSimpleSquaresThreatening(newBoard, node.whosTurn)
                     - boardEvaluationSimpleSquaresThreatening(newBoard, whosTurn)
                ];
                return {
                    board: newBoard,
                    whosTurn,
                    moveToGetHere: move,
                    evaluation,
                    next: undefined
                }
            })
        }
        return node;
    }

    evaluationSingleValue(evaluation: number[]):number {
        const reducerFunc = (prev:number, current:number) => prev + current;
        return evaluation.reduce(reducerFunc);
    }

    bestNextMove(node:BoardTreeNode):BoardTreeNode {
        if (node.next === undefined) {
            throw Error('No boards get Best Next Move');
        }
        const sortFunc = (a: BoardTreeNode, b: BoardTreeNode) => this.evaluationSingleValue(b.evaluation) - this.evaluationSingleValue(a.evaluation)
        const newOrder = node.next.sort(sortFunc);
        return newOrder[0];
    }

    minimax(node:BoardTreeNode, depth:number, maximisingPlayer:Colour):number {
        const maxReducer = (a:number,b:number):number => Math.max(a,b);
        const minReducer = (a:number,b:number):number => Math.min(a,b);
        const moveToText = (move:Move) => `{${move.from.x},${move.from.y}} => {${move.to.x},${move.to.y}}`
        const mText = node.moveToGetHere !== undefined ? moveToText(node.moveToGetHere):'undef';
        if (depth === 0) {
            node.minimaxValue = this.evaluationSingleValue(node.evaluation);
            return node.minimaxValue
        }
        // console.log(`minimax: depth:${depth} mtgh:${mText}`);
        if (node.whosTurn === maximisingPlayer) {
            const allChildren = this.expandTreeNode(node);
            if (allChildren.next === undefined || allChildren.next.length === 0) {
                return this.evaluationSingleValue(node.evaluation);
            }
            return allChildren.next.map( (child) => {
                const newDepth = depth - 1;
                child.minimaxValue = this.minimax(child, newDepth, maximisingPlayer);
                return child.minimaxValue;
            }).reduce(maxReducer);
        } else {
            const allChildren = this.expandTreeNode(node);
            if (allChildren.next === undefined || allChildren.next.length === 0) {
                return this.evaluationSingleValue(node.evaluation);
            }
            return allChildren.next.map( (child) => {
                const newDepth = depth - 1;
                child.minimaxValue = this.minimax(child, newDepth, maximisingPlayer);
                return child.minimaxValue;
            }).reduce(minReducer); 
        }
    }

    // Change this to return a Move
    engineMinimaxCalcBestMove(board:Board, whosTurn:Colour):Move {
        const node1:BoardTreeNode = {
            board,
            whosTurn, 
            moveToGetHere: undefined,
            evaluation: [0,0],
            next: undefined
        }
        const val = this.minimax(node1, 3, whosTurn);
        console.log('m is ', val);
        console.log('node is ', node1);
        if (node1.next !== undefined) {
            const best = node1.next.filter( (node) => node.minimaxValue === val) 
            console.log('best is ', best);
            if (best[0]) {
                if (best[0].moveToGetHere) {
                    return best[0].moveToGetHere;
                    // const asCoordFixThisSheesh = [ best[0].moveToGetHere?.from, best[0].moveToGetHere?.to];
                    // return asCoordFixThisSheesh;
                }
            }
            
        }
        // const move:Move = {
        //     from: { x:1,y:1},
        //     to: {x:2,y:2}
        // };
        throw Error('Engine: Unable to get a move!');
    }

    // engineMove(board:Board, whosTurn:Colour):Move {
    //     // console.log('In Engine');
    //     // const bits = this.getAllPiecesForColour(board, Colour.White);
    //     // console.log('White has pieces: ', bits);
    //     // const moves = this.getAllPossibleMoves(board, Colour.White);
    //     // console.log('White has possible moves: ', moves);
    //     // const boards = this.getAllPossibleBoards(board, Colour.White);
    //     // console.log('possible boards: ', boards);
    //     // const eval1 = boardEvaluationSimpleCountPieces(board, Colour.White);
    //     // const eval2 = boardEvaluationSimpleSquaresThreatening(board, Colour.White);
    //     // console.log('evaluation: ', eval1, eval2);
    //     const node1:BoardTreeNode = {
    //         board,
    //         whosTurn, 
    //         moveToGetHere: undefined,
    //         evaluation: [0,0],
    //         next: undefined
    //     }

    //     const newNode = this.expandTreeNode(node1);
    //     console.log('Node: ', newNode);

    //     const bestMove = this.bestNextMove(newNode);
    //     console.log('Best Move: ', bestMove);

    //     if (bestMove.moveToGetHere) {
    //         return bestMove.moveToGetHere;
    //     } else {
    //         throw Error('asndsds');
    //     }
    // }
}