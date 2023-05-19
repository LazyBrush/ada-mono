import { boardInit, boardMovePiece, boardPieceAt } from "./board-functional";
import { CheckCheckerClass } from "./check-checker-class";
import { EngineClass } from "./engine-class";
import { Board, Colour, Move } from "./internal-board.type";
import { MovesClass } from "./moves-class";

export enum GameState {
    NotPlaying = 'NotPlaying',   
    Playing = 'Playing',
    GameOver = 'GameOver'
};

export enum GameResult {
    WhiteWon = 'WhiteWon',
    BlackWon = 'BlackWon',
    Draw = 'Draw'
  }

export class GameControllerClass {
    moves = new MovesClass();
    checker = new CheckCheckerClass();
    engine = new EngineClass();
    gameState:GameState = GameState.NotPlaying;
    whosTurn:Colour = Colour.White;
    board:Board = [];
    history:Move[] = [] as Move[];
    infoLine:String = "";

    constructor () {
        this.initNewGame();
    }

    initNewGame() {
        this.board = boardInit();
        this.history = [];
        this.whosTurn = Colour.White;
        this.gameState = GameState.Playing;    
        this.infoLine = "New Game Started";
    }

    whosTurnIsIt():Colour {
        return this.whosTurn;
    }
    whosTurnIsItNext() {
        return this.whosTurn === Colour.White ? Colour.Black : Colour.White;
    }

    getGameState():GameState {
        return this.gameState;
    }

    areWePlaying():boolean {
        return this.gameState === GameState.Playing;
    }

    getCurrentBoard():Board {
        return this.board;
    }

    getHistory():Move[] {
        return this.history;
    }

    updateHistory(move:Move) {
        const piece = boardPieceAt(this.board,move.to);
        move.info = piece?.name;
        this.history.push(move);
    }

    isValidMove(move:Move):boolean {
        if (this.areWePlaying() === false) {
            console.log('not playing');
            return false;
        }
        // it is a piece one of the players pieces
        const piece = boardPieceAt(this.board, move.from);
        if (piece === undefined) {
            console.log('no piece');
            return false;
        }
        if (piece.colour !== this.whosTurnIsIt()) {
            console.log('wrong piece colour');
            return false;
        }

        const legalMovesForThisPiece = this.engine.getAllPossibleLegalMovesForPiece(piece, this.board);

        const filterThisMoveInList = legalMovesForThisPiece
            .filter( (legalMove) => this.moves.moveEqual(move,legalMove) );

        if (filterThisMoveInList.length) {
            return true;
        } else {
            return false;
        }

    }

    getInfoLine() {
        return this.infoLine;
    }

    submitMove(move:Move):boolean {
        if (this.isValidMove(move) === false) {
            return false;
        }

        const newBoard = boardMovePiece(this.board, move);
        this.board = newBoard;

        // TODO: is the game over, opponent checkmate?
        // if so change the state
        const inCheck = this.checker.isColourInCheck(this.board, this.whosTurnIsItNext());
        this.infoLine = inCheck ? `${this.whosTurnIsItNext()} is IN CHECK` : '';

        const canMoveNext = this.checker.anyPossibleMoves(this.board, this.whosTurnIsItNext());
        console.log('GC: ', canMoveNext === false ? "CHECK MATE" : "ok");
        if (canMoveNext === false) {
            this.infoLine = `CHECK MATE! ${this.whosTurnIsIt()} WINS!`
        }

        this.whosTurn = this.whosTurnIsItNext();

        this.updateHistory(move);

        return true;  
    }

}