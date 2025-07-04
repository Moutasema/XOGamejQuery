import { GameMove } from './GameMove';
import { GameEngine } from './GameEngine';

export const global = {
  invertSymbol: (symbol: string): string => {
    switch (symbol) {
      case "x":
        return "o";
      case "o":
        return "x";
      default:
        return symbol;
    }
  }
};

export class ThinkingNode {
  relatedGameMove: GameMove | null = null;
  xFunction: number = 0;
  oFunction: number = 0;
  isWinningMove: boolean = false;
  relatedGamePad: (string | null)[][] | null = null;
  nodes: ThinkingNode[] | null = null;
  opponentMove: boolean = false;

  calculateHeuristic(playerSymbol: string): number {
    let sum = 0;
    const INFINITY = 9999;
    
    if (this.isWinningMove) {
      sum += INFINITY;
    }
    
    switch (playerSymbol) {
      case "x":
        sum += (this.xFunction - this.oFunction);
        break;
      case "o":
        sum += (this.oFunction - this.xFunction);
        break;
    }
    return sum;
  }

  totalHeuristic(playerSymbol: string): number {
    const childHeuristics: number[] = [];
    let maxChildHeuristic = 0;
    let sum = 0;
    
    if (this.isWinningMove) {
      return this.calculateHeuristic(playerSymbol);
    }
    
    if (this.nodes) {
      this.nodes.forEach(childThinkingNode => {
        childHeuristics.push(childThinkingNode.totalHeuristic(global.invertSymbol(playerSymbol)));
      });
    }
    
    if (childHeuristics.length) {
      maxChildHeuristic = Math.max(...childHeuristics);
    }
    
    if (this.opponentMove) {
      sum = (-1 * this.calculateHeuristic(playerSymbol)) + maxChildHeuristic;
    } else {
      sum = this.calculateHeuristic(playerSymbol) + (-1 * maxChildHeuristic);
    }
    
    return sum;
  }
}

export class MinimaxGameStrategy {
  gameEngine: GameEngine;
  MAX_THINKING_LEVEL: number = 2;

  constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
  }

  isWinningMove(symbol: string, symbolLine: (string | null)[]): boolean {
    return symbolLine.every(symbolCell => symbolCell === symbol);
  }

  hasPotential(symbol: string, symbolLine: (string | null)[]): boolean {
    return symbolLine.every(symbolCell => symbolCell === symbol || symbolCell === null);
  }

  calculateRows(symbol: string, thinkingNode: ThinkingNode): void {
    if (!thinkingNode.relatedGamePad) return;
    
    for (let row = 0; row < thinkingNode.relatedGamePad.length; row++) {
      const symbolLine: (string | null)[] = [];
      for (let column = 0; column < thinkingNode.relatedGamePad.length; column++) {
        symbolLine.push(thinkingNode.relatedGamePad[row][column]);
      }
      
      if (this.isWinningMove(symbol, symbolLine)) {
        thinkingNode.isWinningMove = true;
        return;
      }
      
      if (this.hasPotential(symbol, symbolLine)) {
        switch (symbol) {
          case "x":
            thinkingNode.xFunction++;
            break;
          case "o":
            thinkingNode.oFunction++;
            break;
        }
      }
    }
  }

  calculateColumns(symbol: string, thinkingNode: ThinkingNode): void {
    if (!thinkingNode.relatedGamePad) return;
    
    for (let column = 0; column < thinkingNode.relatedGamePad.length; column++) {
      const symbolLine: (string | null)[] = [];
      for (let row = 0; row < thinkingNode.relatedGamePad.length; row++) {
        symbolLine.push(thinkingNode.relatedGamePad[row][column]);
      }
      
      if (this.isWinningMove(symbol, symbolLine)) {
        thinkingNode.isWinningMove = true;
        return;
      }
      
      if (this.hasPotential(symbol, symbolLine)) {
        switch (symbol) {
          case "x":
            thinkingNode.xFunction++;
            break;
          case "o":
            thinkingNode.oFunction++;
            break;
        }
      }
    }
  }

  calculateDiagonals(symbol: string, thinkingNode: ThinkingNode): void {
    if (!thinkingNode.relatedGamePad) return;
    
    for (let diagonal = 0; diagonal < 2; diagonal++) {
      const symbolLine: (string | null)[] = [];
      for (let row = 0; row < thinkingNode.relatedGamePad.length; row++) {
        let column = 0;
        switch (diagonal) {
          case 0:
            column = row;
            break;
          case 1:
            column = (thinkingNode.relatedGamePad.length - 1) - row;
            break;
        }
        symbolLine.push(thinkingNode.relatedGamePad[row][column]);
      }
      
      if (this.isWinningMove(symbol, symbolLine)) {
        thinkingNode.isWinningMove = true;
        return;
      }
      
      if (this.hasPotential(symbol, symbolLine)) {
        switch (symbol) {
          case "x":
            thinkingNode.xFunction++;
            break;
          case "o":
            thinkingNode.oFunction++;
            break;
        }
      }
    }
  }

  calculateXFunction(thinkingNode: ThinkingNode): void {
    if (thinkingNode.nodes) {
      thinkingNode.nodes.forEach(childThinkingNode => {
        this.calculateXFunction(childThinkingNode);
      });
    }
    this.calculateRows("x", thinkingNode);
    this.calculateColumns("x", thinkingNode);
    this.calculateDiagonals("x", thinkingNode);
  }

  calculateOFunction(thinkingNode: ThinkingNode): void {
    if (thinkingNode.nodes) {
      thinkingNode.nodes.forEach(childThinkingNode => {
        this.calculateOFunction(childThinkingNode);
      });
    }
    this.calculateRows("o", thinkingNode);
    this.calculateColumns("o", thinkingNode);
    this.calculateDiagonals("o", thinkingNode);
  }

  calculateHeuristic(thinkingNode: ThinkingNode): void {
    this.calculateXFunction(thinkingNode);
    this.calculateOFunction(thinkingNode);
  }

  getEmptyCells(gamePad: (string | null)[][]): { row: number; column: number }[] {
    const emptyCellsIndices: { row: number; column: number }[] = [];
    for (let row = 0; row < gamePad.length; row++) {
      for (let column = 0; column < gamePad[row].length; column++) {
        if (gamePad[row][column] === null) {
          emptyCellsIndices.push({ row, column });
        }
      }
    }
    return emptyCellsIndices;
  }

  cloneGamePad(gamePad: (string | null)[][]): (string | null)[][] {
    return gamePad.map(row => [...row]);
  }

  generatePossibleMoves(
    gamePad: (string | null)[][],
    symbol: string,
    currentLevel: number = 1
  ): ThinkingNode[] | null {
    if (currentLevel > this.MAX_THINKING_LEVEL) {
      return null;
    }
    
    const emptyCellsIndices = this.getEmptyCells(gamePad);
    const possibleMoves: ThinkingNode[] = [];
    
    emptyCellsIndices.forEach(currentIndex => {
      const thinkingNode = new ThinkingNode();
      thinkingNode.relatedGamePad = this.cloneGamePad(gamePad);
      thinkingNode.relatedGamePad[currentIndex.row][currentIndex.column] = symbol;
      thinkingNode.relatedGameMove = new GameMove(symbol, currentIndex.row, currentIndex.column);
      
      const subNodes = this.generatePossibleMoves(
        thinkingNode.relatedGamePad,
        global.invertSymbol(symbol),
        currentLevel + 1
      );
      
      if (subNodes) {
        thinkingNode.nodes = subNodes;
      }
      
      if (currentLevel % 2 === 0) {
        thinkingNode.opponentMove = true;
      }
      
      possibleMoves.push(thinkingNode);
    });
    
    return possibleMoves;
  }

  think(symbol: string): GameMove {
    const possibleMoves = this.generatePossibleMoves(this.gameEngine.gamePad.pad, symbol);
    if (!possibleMoves || possibleMoves.length === 0) {
      // Fallback to first available move
      const emptyCells = this.getEmptyCells(this.gameEngine.gamePad.pad);
      if (emptyCells.length > 0) {
        return new GameMove(symbol, emptyCells[0].row, emptyCells[0].column);
      }
      throw new Error("No moves available");
    }
    
    let bestIndex = 0;
    let best = -9999999;
    
    possibleMoves.forEach((possibleMove, i) => {
      this.calculateHeuristic(possibleMove);
      const randomPossibility = Math.round(Math.random());
      const heuristic = possibleMove.totalHeuristic(symbol);
      
      if (heuristic > best || (heuristic === best && randomPossibility === 1)) {
        best = heuristic;
        bestIndex = i;
      }
    });
    
    return possibleMoves[bestIndex].relatedGameMove!;
  }
}