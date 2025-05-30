import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece, faHomeUser } from '@fortawesome/free-solid-svg-icons';
import SudokuBoard from './components/SudokuBoard';
import GameOver from './components/GameOver';
import { generatePuzzle } from './utils/sudokuGenerator';
import './App.css';

function App() {
  const [gameData, setGameData] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Add a key to force re-render

  // Generate a new puzzle
  const generateNewGame = () => {
    const newGame = generatePuzzle(difficulty);
    setGameData(newGame);
    setShowGameOver(false);
    setGameStarted(true);
    setGameKey(prevKey => prevKey + 1); // Increment key to force re-render
  };

  // Initialize the game
  useEffect(() => {
    if (!gameStarted) {
      generateNewGame();
    }
  }, [gameStarted]);

  // Handle game completion
  const handleGameComplete = () => {
    setShowGameOver(true);
    setGameSuccess(true);
  };

  // Handle game failure
  const handleGameFailed = () => {
    setShowGameOver(true);
    setGameSuccess(false);
  };

  // Restart the game
  const handleRestart = () => {
    setShowGameOver(false);
    setGameStarted(false);
    setTimeout(() => {
      generateNewGame();
    }, 100); // Small delay to ensure state updates properly
  };

  // Change difficulty
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="navbar bg-primary text-primary-content shadow-lg">
        <div className="navbar-start">
          <FontAwesomeIcon icon={faPuzzlePiece} className="text-2xl ml-4" />
        </div>
        <div className="navbar-center">
          <h1 className="text-2xl font-bold">Sudoku Q</h1>
        </div>
        <div className="navbar-end">
          <a 
            href="https://github.com/amarpreetbhatia/sudoku-q" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle"
          >
            <FontAwesomeIcon icon={faHomeUser} className="text-xl" />
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Difficulty</span>
            </label>
            <select 
              className="select select-bordered w-full" 
              value={difficulty} 
              onChange={handleDifficultyChange}
              disabled={gameStarted && !showGameOver}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <button 
            className="btn btn-primary w-full md:w-auto self-end"
            onClick={handleRestart}
          >
            New Game
          </button>
        </div>

        <div className="card bg-base-200 shadow-xl p-4 md:p-8 max-w-3xl mx-auto">
          {gameData && (
            <SudokuBoard 
              key={gameKey} // Add key to force re-render
              puzzle={gameData.puzzle} 
              solution={gameData.solution}
              onGameComplete={handleGameComplete}
              onGameFailed={handleGameFailed}
            />
          )}
        </div>

        {showGameOver && (
          <GameOver 
            success={gameSuccess} 
            onRestart={handleRestart} 
          />
        )}
      </main>

      <footer className="footer footer-center p-4 bg-base-200 text-base-content mt-8">
        <div>
          <p>© 2025 - Sudoku Q - A fun Sudoku game with a timer</p>
        </div>
      </footer>
    </div>
  );
}

export default App;