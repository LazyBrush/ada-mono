import { Colour, Name, Piece } from '@ada-mono/chess-base';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string; piece: Piece } {
    const piece: Piece = {
      pos: {
        x: 1,
        y: 1,
      },
      colour: Colour.White,
      name: Name.Queen,
      id: 'example queen',
    };
    return { message: 'Welcome to board-eval!', piece };
  }
}
