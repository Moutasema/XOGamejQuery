import './GameIntro.css';

interface GameIntroProps {
  onCharacterSelect: (symbol: string) => void;
}

const GameIntro = ({ onCharacterSelect }: GameIntroProps) => {
  return (
    <div className="game-intro">
      <button 
        className="patrick-btn"
        onClick={() => onCharacterSelect('x')}
        aria-label="Select Patrick (X)"
      >
        <span className="sr-only">Patrick - Play as X</span>
      </button>
      <button 
        className="sponge-btn"
        onClick={() => onCharacterSelect('o')}
        aria-label="Select SpongeBob (O)"
      >
        <span className="sr-only">SpongeBob - Play as O</span>
      </button>
    </div>
  );
};

export default GameIntro;