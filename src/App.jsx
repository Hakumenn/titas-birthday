import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './App.css';

const CARD_IMAGES = [
  '/images/image1.jpg', 
  '/images/image2.jpg',
  '/images/image3.jpg',
  '/images/image4.jpg',
  '/images/image5.jpg',
  '/images/image6.jpg',
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  const initializeGame = () => {
    const pairedImages = [...CARD_IMAGES, ...CARD_IMAGES];
    
    for (let i = pairedImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairedImages[i], pairedImages[j]] = [pairedImages[j], pairedImages[i]];
    }

    const shuffledCards = pairedImages.map((imageUrl, index) => ({
      id: index,
      imageUrl, 
      isFlipped: false,
      isMatched: false,
    }));
    
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setIsGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (newCards[firstIndex].imageUrl === newCards[secondIndex].imageUrl) {
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setMatchedPairs((prev) => prev + 1);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs === CARD_IMAGES.length && CARD_IMAGES.length > 0) {
      setTimeout(() => setIsGameWon(true), 600); 
    }
  }, [matchedPairs]);

  return (
    <div className="app-container">
      {isGameWon && (
        <Confetti 
          width={window.innerWidth} 
          height={window.innerHeight} 
          colors={['#f72b43', '#ff69b4', '#ffffff', '#000000', '#ffd900']} 
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      {!isGameWon ? (
        <div className="game-container fade-in">
          <h2>Match the photos for your present! 🧩</h2>

          <div className="card-grid">
            {cards.map((card, index) => (
              <div 
                key={card.id} 
                className="card-wrapper"
                onClick={() => handleCardClick(index)}
              >
                <div className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}>
                  <div className="card-face card-front">
                    🎀
                  </div>
                  <div className="card-face card-back">
                    <img src={card.imageUrl} alt={`Memory ${index}`} className="card-image" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="open-card fade-in">
          <h1>🎉 Happy Birthday! 🎂</h1>
          
          <div className="message-box">
            <p><strong>Dearest Tita,Mother</strong></p>
            <p>
              Happy Birthday, Tita,Mother dear! Thank you for taking care of us. We just want to say how much we love and appreciate you. Thank you for your endless care, support, and the warmth you always give.
            </p>
            <p>
              May your day be filled with happiness, laughter, and all the things that make you smile. You deserve all the love and blessings today and always.
            </p>
            <p className="signature">We love you! <br/>- Patrick & abi</p>
          </div>
          
          <button className="restart-button" onClick={initializeGame}>
            Play Again 🎀
          </button>
        </div>
      )}
    </div>
  );
}

export default App;