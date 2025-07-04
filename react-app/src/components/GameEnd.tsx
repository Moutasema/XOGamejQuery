import './GameEnd.css';

interface GameEndProps {
  result: 'won' | 'lost' | 'tie';
  onPlayAgain: () => void;
  onCharacterSelect: () => void;
}

const GameEnd = ({ result, onPlayAgain, onCharacterSelect }: GameEndProps) => {
  const getResultImage = () => {
    switch (result) {
      case 'won':
        return '/youwon.png';
      case 'lost':
        return '/youlost.png';
      case 'tie':
        return '/youlost.png'; // Using same image for tie
      default:
        return '/youwon.png';
    }
  };

  const getResultText = () => {
    switch (result) {
      case 'won':
        return 'You Won!';
      case 'lost':
        return 'You Lost!';
      case 'tie':
        return 'It\'s a Tie!';
      default:
        return 'Game Over';
    }
  };

  return (
    <div className="game-end">
      <img 
        src={getResultImage()} 
        className="game-result" 
        alt={getResultText()}
      />
      <button 
        className="character-select-btn"
        onClick={onCharacterSelect}
        aria-label="Back to Character Selection"
      >
        <span className="sr-only">Character Select</span>
      </button>
      <button 
        className="play-again-btn"
        onClick={onPlayAgain}
        aria-label="Play Again"
      >
        <span className="sr-only">Play Again</span>
      </button>
    </div>
  );
};

export default GameEnd;