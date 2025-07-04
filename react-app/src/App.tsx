import { useState } from 'react'
import './App.css'
import { GameEngine, HumanPlayer, PcPlayer, MinimaxGameStrategy, GameMove } from './game'
import GameIntro from './components/GameIntro'
import GameBoard from './components/GameBoard'
import GameEnd from './components/GameEnd'

type GameState = 'intro' | 'playing' | 'ended';

function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [humanSymbol, setHumanSymbol] = useState<string>('');
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameUpdateCounter, setGameUpdateCounter] = useState(0);
  const [gameResult, setGameResult] = useState<'won' | 'lost' | 'tie'>('won');

  const handleCharacterSelect = (symbol: string) => {
    setHumanSymbol(symbol);
    startGame(symbol);
  };

  const startGame = (symbol: string) => {
    console.log('App: Starting game with symbol:', symbol);
    const humanPlayer = new HumanPlayer(symbol);
    const pcPlayer = new PcPlayer(symbol === "o" ? "x" : "o");
    
    const engine = new GameEngine(humanPlayer, pcPlayer);
    console.log('App: Created engine:', engine);
    console.log('App: GamePad:', engine.gamePad);
    console.log('App: GamePad.pad:', engine.gamePad.pad);
    
    pcPlayer.strategy = new MinimaxGameStrategy(engine);
    
    setGameEngine(engine);
    setGameState('playing');
  };

  const handlePlayerMove = (row: number, col: number) => {
    if (!gameEngine) return;

    const humanPlayer = gameEngine.humanPlayer;
    const pcPlayer = gameEngine.pcPlayer as PcPlayer;

    // Human move
    gameEngine.move(new GameMove(humanPlayer.symbol, row, col));
    setGameUpdateCounter(prev => prev + 1);
    
    // Check if game is over after human move
    if (gameEngine.isGameOver()) {
      const winner = gameEngine.isGameOver();
      handleGameEnd(winner);
      return;
    }

    // PC move
    setTimeout(() => {
      const pcMove = pcPlayer.think();
      gameEngine.move(pcMove);
      setGameUpdateCounter(prev => prev + 1);
      
      // Check if game is over after PC move
      if (gameEngine.isGameOver()) {
        const winner = gameEngine.isGameOver();
        handleGameEnd(winner);
      }
    }, 500); // Small delay to make PC move visible
  };

  const handleGameEnd = (winner: string | false) => {
    if (winner === false) return;
    
    let result: 'won' | 'lost' | 'tie';
    if (winner === 'tie') {
      result = 'tie';
    } else {
      result = winner === humanSymbol ? 'won' : 'lost';
    }
    
    setGameResult(result);
    setGameState('ended');
  };

  const handlePlayAgain = () => {
    startGame(humanSymbol);
  };

  const handleBackToCharacterSelect = () => {
    setGameState('intro');
    setGameEngine(null);
    setHumanSymbol('');
  };

  return (
    <div className="app">
      {gameState === 'intro' && (
        <GameIntro onCharacterSelect={handleCharacterSelect} />
      )}
      {gameState === 'playing' && gameEngine && (
        <GameBoard 
          gameEngine={gameEngine}
          gameUpdateCounter={gameUpdateCounter}
          onPlayerMove={handlePlayerMove}
        />
      )}
      {gameState === 'ended' && (
        <GameEnd 
          result={gameResult}
          onPlayAgain={handlePlayAgain}
          onCharacterSelect={handleBackToCharacterSelect}
        />
      )}
    </div>
  );
}

export default App
