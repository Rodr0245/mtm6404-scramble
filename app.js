/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}
/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const wordsArray = ['swiftie', 'lover', 'evermore', 'folklore', 'reputation', 'fearless', 'red', '1989', 'speaknow', 'midnights'];

const Scramble = () => {
  // Initial state of the game
  const initialState = {
    score: 0,
    strikes: 0,
    currentWordIndex: 0,
    passesRemaining: 3,
    words: wordsArray,
  };

  // State of the game, stored in local storage
  const [gameState, setGameState] = React.useState(() => {
    // Get the state from local storage, or use the initial state if it's not there
    const savedState = localStorage.getItem('scrambleGameState');
    return savedState ? JSON.parse(savedState) : initialState;
  });

  // The scrambled word that the user has to guess
  const [scrambledWord, setScrambledWord] = React.useState('');
  // The users guess
  const [guess, setGuess] = React.useState('');

  // Shuffles the letters in a string
  const shuffle = (word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Scrambles the current word
  const scrambleCurrentWord = () => {
    const wordToScramble = gameState.words[gameState.currentWordIndex];
    const scrambled = shuffle(wordToScramble);
    setScrambledWord(scrambled);
  };

  // Run this code when the component mounts
  React.useEffect(() => {
    // Scramble the current word
    scrambleCurrentWord();
  }, [gameState.currentWordIndex]);

  // Run this code when the component updates
  React.useEffect(() => {
    // Save the state to local storage
    localStorage.setItem('scrambleGameState', JSON.stringify(gameState));
  }, [gameState]);

  // Gets the high score from local storage
  const getHighScore = () => {
    const highScore = localStorage.getItem('highScore');
    return highScore ? parseInt(highScore, 10) : 0;
  };

  // The high score
  const highScore = getHighScore();

  // Handles the user submitting a guess
  const handleGuessSubmit = (e) => {
  e.preventDefault();

  if (guess.trim() === '') {
    alert('Please enter a guess!');
    return;
  }

  if (guess.toLowerCase() === gameState.words[gameState.currentWordIndex].toLowerCase()) {
    if (gameState.currentWordIndex === gameState.words.length - 1) {
      // Correct answer on the last word
      setGameState((prevState) => {
        const finalScore = prevState.score + 1;
        alert('Correct! You get a point.');
        localStorage.setItem('highScore', Math.max(finalScore, highScore));
        return { ...initialState, score: finalScore };
      });
      alert(`Game Over! You completed all words. Final score: ${gameState.score + 1}`);
      if (confirm('Restart the game?')) {
        setGameState(initialState);
      }
    } else {
      setGameState((prevState) => ({
        ...prevState,
        score: prevState.score + 1,
        currentWordIndex: prevState.currentWordIndex + 1,
      }));
      alert('Correct! You get a point.');
      setGuess('');
    }
  } else {
    setGameState((prevState) => ({
      ...prevState,
      strikes: prevState.strikes + 1,
    }));
    alert('Incorrect! You get a strike.');
    setGuess('');
  }

  if (gameState.strikes >= 2 && gameState.currentWordIndex < gameState.words.length - 1) {
    endGame();
  }
};

// Handles the user passing on a word
const handlePass = () => {
  if (gameState.passesRemaining > 0) {
    if (gameState.currentWordIndex === gameState.words.length - 1) {
      endGame();
    } else {
      alert('Skipped word!');
      setGameState((prevState) => ({
        ...prevState,
        passesRemaining: prevState.passesRemaining - 1,
        currentWordIndex: prevState.currentWordIndex + 1,
      }));
    }
  } else {
    alert('No passes remaining!');
  }
};

// Ends the game
const endGame = () => {
  const finalScore = gameState.score;
  const maxScore = Math.max(finalScore, highScore);
  localStorage.setItem('highScore', maxScore);

  alert(`Game Over! You scored ${finalScore} points. High score: ${maxScore}.`);
  if (confirm('Restart the game?')) {
    setGameState(initialState);
    setGuess('');
  }
};

  return (
    <div>
      <h1>Scramble</h1>
      <h3>High Score: {highScore}</h3>
      <h3>Current Score: {gameState.score}</h3>
      <h3>Current Strikes: {gameState.strikes}</h3>
      <h3>Passes Remaining: {gameState.passesRemaining}</h3>
      <h2>Next Word: {scrambledWord}</h2>

      <form onSubmit={handleGuessSubmit}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Your guess"
        />
        <button class='btn' type="submit">Submit Guess</button>
      </form>
      <div class='btnGroup'>
        <button  class='btn' onClick={handlePass}>Pass</button>
        <button  class='btn' onClick={endGame}>Restart Game</button>
      </div>
    </div>
  );
};

// Render the Scramble component
ReactDOM.createRoot(document.getElementById('root')).render(<Scramble />);


