import { GameMove } from './GameMove';
import { GamePad } from './GamePad';
import { Player } from './Players';

export class GameEngine {
  humanPlayer: Player;
  pcPlayer: Player;
  gamePad: GamePad;

  constructor(humanPlayer: Player, pcPlayer: Player) {
    this.humanPlayer = humanPlayer;
    this.pcPlayer = pcPlayer;
    this.gamePad = new GamePad();
  }

  move(gameMove: GameMove): void {
    this.gamePad.addMove(gameMove);
  }

  isGameOver(): string | false {
    if (this.gamePad.isGameOver) {
      return this.gamePad.winnerSymbol || false;
    }
    return false;
  }

  clone(): GameEngine {
    const clonedEngine = new GameEngine(this.humanPlayer, this.pcPlayer);
    clonedEngine.gamePad = this.gamePad.clone();
    return clonedEngine;
  }
}