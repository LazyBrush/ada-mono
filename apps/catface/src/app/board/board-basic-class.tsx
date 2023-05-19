
import { Board, Square, Name, Colour } from './internal-board.type';

// Makes a board with the pieces in the right starting position

export class BoardBasicClass {
    board: Board;

    constructor() {
        this.board = this.initBoard();
    }

    initChessmenRow(colour:Colour,rowNum:number):Square[] {
        const rowNames= [Name.Castle, Name.Knight, Name.Bishop, Name.Queen, Name.King, Name.Bishop, Name.Knight, Name.Castle];
        return rowNames.map( (name, index): Square => {
            return  {
                pos: {
                    x:index,
                    y:rowNum
                },
                name,
                colour,
                id: `${name}-${colour}-${index}-${rowNum}`
            }
        });
    }

    initPawnRow(colour:Colour,rowNum:number):Square[] {
        const arrayOfEight = Array.from(Array(8).keys());
        return arrayOfEight.map( (column): Square => {
            return {
                pos: {
                    x:column,
                    y:rowNum
                },
                name:Name.Pawn,
                colour,
                id: `${Name.Pawn}-${colour}-${column}-${rowNum}`
            }
        })
    }

    initBoard():Board {
        console.log('Initialise board');
        const board:Square[] = [];
        const blackChessmen:Square[] = this.initChessmenRow(Colour.Black, 7);
        const blackPawns:Square[] = this.initPawnRow(Colour.Black,6);
        const middle:Square[] = Array(32);
        const whitePawns:Square[] = this.initPawnRow(Colour.White,1);
        const whiteChessmen:Square[] = this.initChessmenRow(Colour.White, 0);
        return board.concat(whiteChessmen,whitePawns,middle,blackPawns,blackChessmen);
    }

    getBoard():Board {
        return this.board;
    }
}