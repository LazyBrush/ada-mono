import { boardIsPieceAt, boardPieceAt } from "./board-functional";
import { Board, Colour, Coord, Move, Name, Piece } from "./internal-board.type";

type ReducerShape = {
    result: Coord[];
    keepGoing?: boolean;
    pos?: Coord;
  }

export class MovesClass {
    kingMoves:Coord[] = [ {x:-1,y:-1}, {x:-1,y:0}, {x:-1,y:1}, {x:0,y:-1}, {x:0, y:1}, {x:1, y:-1}, {x:1, y:0}, {x:1, y:1}];
    knightMoves:Coord[] = [ {x:-1,y:-2}, {x:-1,y:2}, {x:-2,y:-1}, {x:-2,y:1}, {x:1,y:-2}, {x:1,y:2}, {x:2,y:-1}, {x:2,y:1}];

    seven = Array.from(Array(7).keys()).map((x) => x+1); // [1,2,3,4,5,6,7]
    bishopSlideMoves:Coord[] = [{x:1,y:1}, {x:1,y:-1}, {x:-1,y:1}, {x:-1,y:-1}];
    castleSlideMoves:Coord[] = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
    queenSlideMoves:Coord[] = this.bishopSlideMoves.concat(this.castleSlideMoves);

    private directionOfOpponent(colour:Colour):number {
        switch(colour) {
            case Colour.White: 
                return 1;
            case Colour.Black:
                return -1;
            default:
                return 0;
        }
    }

    isThisMoveAPawnPromotion(piece:Piece):Boolean {
        if (piece.name !== Name.Pawn) {
            return false;
        }
        switch(piece.colour) {
            case Colour.White: 
                return piece.pos.y === 6;
            case Colour.Black:
                return piece.pos.y === 1;
            default:
                return false;
        }
    }

    pawnStartingRow(colour:Colour):number {
        switch(colour) {
            case Colour.White: 
                return 1;
            case Colour.Black:
                return 6;
            default:
                return 0;
        }
    }

    pawnForwardMoves(piece:Piece, board:Board):Coord[] {
        // forget about En Passant for now
        if (piece.name !== Name.Pawn) {
            return [];
        } else {
            const yMove = this.directionOfOpponent(piece.colour);
            if (piece.pos.y === this.pawnStartingRow(piece.colour)) {
                const inFront = {x:piece.pos.x, y:piece.pos.y+yMove};
                if (boardIsPieceAt(board, inFront)) {
                    return [];
                }
                const twoInFront = {x:piece.pos.x, y:piece.pos.y+2*yMove};
                if (boardIsPieceAt(board, twoInFront)) {
                    return [{x:0,y:yMove}];
                }
                // first pawn move, 1 or 2 moves forward
                return [{x:0,y:yMove}, {x:0,y:2*yMove}];
            } else {
                // after that, 1 move only
                const inFront = {x:piece.pos.x, y:piece.pos.y+yMove};
                if (boardIsPieceAt(board, inFront)) {
                    return [];
                }
                return [{x:0,y:yMove}];
            }
        }
    }

    pawnTakeMoves(piece:Piece, board:Board):Coord[] {
        const yMove = this.directionOfOpponent(piece.colour);
        const possibleTakes = [
            {
            x:piece.pos.x+1,
            y:piece.pos.y+yMove
            },
            {
            x:piece.pos.x-1,
            y:piece.pos.y+yMove
            }
        ];
        return possibleTakes
            .filter((pos:Coord):boolean => this.isPositionOnBoard(pos))
            .filter((pos:Coord):boolean => boardIsPieceAt(board, pos))
            .filter((pos:Coord):boolean => {
                const moveToPiece = boardPieceAt(board, pos) as Piece;
                return moveToPiece.colour !== piece.colour
            })
            .map( (coord) => {
                // change back to relative movement
                // ToDo: refactor this
                return {x:coord.x-piece.pos.x,y:coord.y-piece.pos.y}
            });
    }

    pawnMoves(piece:Piece, board:Board):Coord[] {
        return this.pawnForwardMoves(piece,board).concat(this.pawnTakeMoves(piece,board));
    }

    movesForPiece(piece:Piece, board:Board):Coord[] {
        switch(piece.name) {
            case Name.King:
                return this.kingMoves;
            case Name.Knight:
                return this.knightMoves;
            case Name.Pawn:
                return this.pawnMoves(piece,board);
            default:
                return []
        }
    }

    isPositionOnBoard(pos:Coord):boolean {
        if (pos.x >= 0 && pos.x <= 7 && pos.y >= 0 && pos.y <= 7) {
            return true;
        } else {
            return false;
        }
    }

    pseudoLegalCoordsForPiece(piece:Piece, board:Board): Coord[] {
        let slideMoves;
        switch(piece.name) {
            case Name.Queen:
                slideMoves = this.queenSlideMoves;
                break;
            case Name.Castle:
                slideMoves = this.castleSlideMoves;
                break;
            case Name.Bishop:
                slideMoves = this.bishopSlideMoves;
                break;
            default:
                const pmoves = this.movesForPiece(piece, board);
                return pmoves
                // map all those moves onto where this piece is
                .map( (move:Coord):Coord => ({ x: move.x + piece.pos.x, y: move.y + piece.pos.y }) )
                // and remove all the moves outside the board
                .filter( (pos:Coord):boolean => this.isPositionOnBoard(pos) )
                // and remove all moves onto same colour as this piece
                .filter( (pos:Coord):boolean => {
                    const pieceOnBoard = boardPieceAt(board, pos);
                    if (pieceOnBoard) {
                        if (pieceOnBoard.colour === piece.colour) {
                            return false;
                        }
                    }
                    return true;
                });
        }
        return slideMoves.flatMap( (move) => this.slidingPieceReduce(piece, board, move));
    }

    pseudoLegalMoves(piece:Piece, board:Board): Move[] {
        const from = piece.pos;
        return this.pseudoLegalCoordsForPiece(piece, board).map( (to) => {
            return {from, to}
        });
    }

    movesToToCoords(moves:Move[]):Coord[] {
        return moves.map( (move) => {
            return move.to;
        });
    }

    slidingPieceReduce(piece:Piece, board:Board, singleSlideMove:Coord): Coord[] {
        const base = Array.from(Array(7).keys()).map((x) => x+1); // [1,2,3,4,5,6,7]
        const baordCoords = base.map( (n) => {
            return { 
                x: piece.pos.x + (n*singleSlideMove.x), 
                y: piece.pos.y + (n*singleSlideMove.y) 
            }   // [ {x:5,y:5}, {x:6,y:6}, ...]
        }).filter((pos:Coord):boolean => this.isPositionOnBoard(pos));
        if (baordCoords.length === 0) {
            return [];
        }
        const reduceInputArray = baordCoords.map( (coords) => {
            return {
                result:[],
                pos: coords,
            }
        })
        const reduceInitItem:ReducerShape = {
            result: [],        // Final result here, list of coords made up of some of the input array
            keepGoing: true,   // We dont care about moves passed another piece, true when empty spaces
            pos: undefined     // The coord of the possible move
        }
        const reducerFunc = (previousValue:ReducerShape, currentValue:ReducerShape):ReducerShape => {
            const targetPos = currentValue.pos as Coord;
            const targetPiece = boardPieceAt(board, targetPos);
            const keepGoing = targetPiece === undefined ? previousValue.keepGoing : false;
            const addThisPos:Coord[] = (previousValue.keepGoing && targetPiece?.colour !== piece.colour) ? [targetPos] : [];
            const result = previousValue.result.concat(addThisPos);
            // console.log(`Reducer: ${keepGoing} ThisPos (${targetPos.x},${targetPos.y}) ${addThisPos}`);
            return {
                result,
                keepGoing
            }
        }
        const result = reduceInputArray.reduce(reducerFunc, reduceInitItem);
        // console.log('Fancy ', result);
        return result.result;
    }

    moveEqual(m1:Move, m2:Move):boolean {
        return m1.from.x === m2.from.x 
            && m1.from.y === m2.from.y
            && m1.to.x === m2.to.x
            && m1.to.y === m2.to.y;
    }

}