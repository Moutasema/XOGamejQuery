export class GameMove {
  symbol: string;
  row: number;
  column: number;

  constructor(symbol: string, row: number, column: number) {
    this.symbol = symbol;
    this.row = row;
    this.column = column;
  }
}