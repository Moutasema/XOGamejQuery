import { useState, useEffect } from 'react';
import { GameEngine } from '../game';
import './GameBoard.css';

interface GameBoardProps {
  gameEngine: GameEngine;
  gameUpdateCounter: number;
  onPlayerMove: (row: number, col: number) => void;
}

const GameBoard = ({ gameEngine, gameUpdateCounter, onPlayerMove }: GameBoardProps) => {
  const [board, setBoard] = useState<(string | null)[][]>([]);
  const [isWaitingForPC, setIsWaitingForPC] = useState(false);

  useEffect(() => {
    try {
      console.log('GameBoard: useEffect called with gameEngine:', gameEngine);
      console.log('GameBoard: gameUpdateCounter:', gameUpdateCounter);
      // Update board state whenever the game engine changes
      console.log('GameBoard: Updating board, gameEngine:', gameEngine);
      console.log('GameBoard: gamePad.pad:', gameEngine.gamePad.pad);
      setBoard(gameEngine.gamePad.pad.map(row => [...row]));
      setIsWaitingForPC(false);
    } catch (error) {
      console.error('GameBoard: Error updating board:', error);
    }
  }, [gameEngine, gameUpdateCounter]);

  console.log('GameBoard: Rendering, board:', board);

  // Safety check
  if (!gameEngine || !gameEngine.gamePad || !gameEngine.gamePad.pad) {
    console.error('GameBoard: Invalid gameEngine or gamePad');
    return <div>Loading game...</div>;
  }

  // Initialize board if empty
  const currentBoard = board.length === 0 ? gameEngine.gamePad.pad : board;

  const handleCellClick = (row: number, col: number) => {
    if (isWaitingForPC) return;
    if (currentBoard[row][col] !== null) return; // Cell already occupied
    if (gameEngine.isGameOver()) return; // Game is over

    setIsWaitingForPC(true);
    onPlayerMove(row, col);
  };

  const renderCell = (row: number, col: number) => {
    const cellValue = currentBoard[row][col];
    const cellClass = `pad-cell${cellValue ? ` ${cellValue}` : ''}`;
    
    return (
      <button
        key={`${row}-${col}`}
        className={cellClass}
        onClick={() => handleCellClick(row, col)}
        disabled={isWaitingForPC || cellValue !== null}
        aria-label={`Cell ${row + 1}, ${col + 1}${cellValue ? ` - ${cellValue}` : ' - empty'}`}
      >
        <span className="sr-only">
          {cellValue ? `${cellValue.toUpperCase()}` : 'Empty cell'}
        </span>
      </button>
    );
  };

  return (
    <div className="game-play">
      <div className="game-pad">
        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => renderCell(row, col))
        )}
      </div>
      {isWaitingForPC && (
        <div className="disable-game">
          <div className="thinking-indicator">
            Computer is thinking...
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;