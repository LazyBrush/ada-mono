import { EngineClass } from "./engine-class";
import { BoardTreeNode } from "./engine.type";
import { Board, Colour, Coord, Name, Piece, Square } from "./internal-board.type";


export class CheckCheckerClass {
    //engine = new EngineClass();

    findTheKing(board:Board, colour:Colour):Piece[] {
        return board
            .filter( (square:Square):boolean => square !== undefined)
            .map( (square:Square):Piece => square as Piece)
            .filter( (piece) => piece.name === Name.King && piece.colour === colour);
    }

    myKingLocation(board:Board, colour:Colour):Coord {
        const myKing = this.findTheKing(board, colour);
        if (myKing.length !== 1) {
            throw Error('Cannot find the one true King!');
        }
        return myKing[0].pos;
    }

    isColourInCheck(board:Board, colour:Colour):boolean {
        const engine = new EngineClass();
        const opponentColour = colour === Colour.White ? Colour.Black : Colour.White;
        const opponentsMoves = engine.getAllPossibleMoves(board, opponentColour);
        //console.log('moves: ', opponentsMoves);
        const kingLocation = this.myKingLocation(board, colour);
        //console.log('King at: ', kingLocation);
        const checks = opponentsMoves
            .filter( (move) => move.to.x === kingLocation.x && move.to.y === kingLocation.y);
        //console.log('checks: ',checks);
        if (checks.length === 0) {
            return false;   // no opponent moves targeting our king
        } else {
            return true;    // there is at least one move targeting our king
        }
    }

    anyPossibleMoves(board:Board, colour:Colour):boolean {
        const engine = new EngineClass();

        const thisNode:BoardTreeNode = {
            board,
            whosTurn:colour,
            moveToGetHere:undefined,
            evaluation:[],
            next:undefined
        }
        const futureNode = engine.expandTreeNode(thisNode);

        if (futureNode.next) {
            const checkArray = futureNode.next.map( (node) => this.isColourInCheck(node.board, colour));
            //console.log('AnyPossibleMoves: ', checkArray);
            if (checkArray.indexOf(false) === -1) {
                // no future board which is not in check
                // CHECK MATE
                console.log('anyPossibleMoves: NO!')
                return false;
            } else {
                console.log('some moves avail');
                return true;
            }
        }

        return false;
    }

}