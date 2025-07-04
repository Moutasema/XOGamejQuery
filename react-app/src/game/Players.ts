export abstract class Player {
  symbol: string;

  constructor(symbol: string) {
    this.symbol = symbol;
  }
}

export class HumanPlayer extends Player {
  constructor(symbol: string) {
    super(symbol);
  }
}

export class PcPlayer extends Player {
  strategy: any;

  constructor(symbol: string, gameStrategy?: any) {
    super(symbol);
    this.strategy = gameStrategy;
  }

  think(): any {
    return this.strategy.think(this.symbol);
  }
}