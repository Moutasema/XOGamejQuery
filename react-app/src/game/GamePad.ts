import { GameMove } from './GameMove';

export class GamePad {
  padSize: number = 3;
  pad: (string | null)[][];
  isGameOver: boolean = false;
  winnerSymbol: string | null = null;

  constructor() {
    this.pad = new Array(this.padSize);
    for (let x = 0; x < this.pad.length; x++) {
      this.pad[x] = new Array(this.padSize).fill(null);
    }
  }

  clone(): GamePad {
    const newPad = new GamePad();
    for (let i = 0; i < this.padSize; i++) {
      for (let j = 0; j < this.padSize; j++) {
        newPad.pad[i][j] = this.pad[i][j];
      }
    }
    newPad.isGameOver = this.isGameOver;
    newPad.winnerSymbol = this.winnerSymbol;
    return newPad;
  }

  checkRows(): void {
    for (let row = 0; row < this.padSize; row++) {
      let lineMatched = true;
      const symbol = this.pad[row][0];
      
      if (!symbol) continue;
      
      for (let column = 0; column < this.padSize; column++) {
        lineMatched = lineMatched && symbol === this.pad[row][column];
        if (!lineMatched) break;
      }
      
      if (lineMatched) {
        this.endGame(symbol);
      }
    }
  }

  checkColumns(): void {
    for (let column = 0; column < this.padSize; column++) {
      let lineMatched = true;
      const symbol = this.pad[0][column];
      
      if (!symbol) continue;
      
      for (let row = 0; row < this.padSize; row++) {
        lineMatched = lineMatched && symbol === this.pad[row][column];
        if (!lineMatched) break;
      }
      
      if (lineMatched) {
        this.endGame(symbol);
      }
    }
  }

  checkDiagonals(): void {
    for (let diagonal = 0; diagonal < 2; diagonal++) {
      let lineMatched = true;
      const symbol = diagonal === 0 ? this.pad[0][0] : this.pad[0][this.padSize - 1];
      
      if (!symbol) continue;
      
      for (let row = 0; row < this.padSize; row++) {
        let column: number;
        switch (diagonal) {
          case 0:
            column = row;
            break;
          case 1:
            column = (this.padSize - 1) - row;
            break;
          default:
            column = row;
        }
        
        lineMatched = lineMatched && symbol === this.pad[row][column];
        if (!lineMatched) break;
      }
      
      if (lineMatched) {
        this.endGame(symbol);
      }
    }
  }

  checkGameOver(): void {
    let isBoardFull = true;
    for (let row = 0; row < this.padSize; row++) {
      for (let column = 0; column < this.padSize; column++) {
        if (!this.pad[row][column]) {
          isBoardFull = false;
          break;
        }
      }
      if (!isBoardFull) break;
    }
    
    if (isBoardFull) {
      this.isGameOver = true;
      this.winnerSymbol = "tie";
    }
  }

  processGame(): void {
    this.checkRows();
    if (this.isGameOver) return;
    this.checkColumns();
    if (this.isGameOver) return;
    this.checkDiagonals();
    if (this.isGameOver) return;
    this.checkGameOver();
  }

  addMove(gameMove: GameMove): void {
    if (!this.validateMove(gameMove)) return;
    
    this.pad[gameMove.row][gameMove.column] = gameMove.symbol;
    this.processGame();
  }

  validateMove(gameMove: GameMove): boolean {
    if (this.isGameOver) return false;
    if (gameMove.row < 0 || gameMove.row >= this.padSize) return false;
    if (gameMove.column < 0 || gameMove.column >= this.padSize) return false;
    if (this.pad[gameMove.row][gameMove.column]) return false;
    return true;
  }

  possibleMoves(): GameMove[] {
    const moves: GameMove[] = [];
    for (let row = 0; row < this.padSize; row++) {
      for (let column = 0; column < this.padSize; column++) {
        if (!this.pad[row][column]) {
          moves.push(new GameMove("", row, column));
        }
      }
    }
    return moves;
  }

  private endGame(symbol: string): void {
    this.isGameOver = true;
    this.winnerSymbol = symbol;
  }
}