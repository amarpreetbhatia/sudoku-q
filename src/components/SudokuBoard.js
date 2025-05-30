import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faRedo } from '@fortawesome/free-solid-svg-icons';

const SudokuBoard = ({ puzzle, solution, onGameComplete, onGameFailed }) => {
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [prefilled, setPrefilled] = useState([]);
  const [invalidCells, setInvalidCells] = useState([]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize the board
  useEffect(() => {
    if (puzzle) {
      setBoard(JSON.parse(JSON.stringify(puzzle)));
      
      // Track prefilled cells
      const prefilledCells = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (puzzle[row][col] !== 0) {
            prefilledCells.push(`${row}-${col}`);
          }
        }
      }
      setPrefilled(prefilledCells);
    }
  }, [puzzle]);

  // Timer countdown
  useEffect(() => {
    if (gameOver || gameWon) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          onGameFailed();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameOver, gameWon, onGameFailed]);

  // Check if the game is complete
  useEffect(() => {
    if (!board.length) return;
    
    // Check if all cells are filled
    let isFilled = true;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          isFilled = false;
          break;
        }
      }
      if (!isFilled) break;
    }
    
    if (isFilled) {
      // Check if the solution is correct
      let isCorrect = true;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] !== solution[row][col]) {
            isCorrect = false;
            break;
          }
        }
        if (!isCorrect) break;
      }
      
      if (isCorrect) {
        setGameWon(true);
        onGameComplete();
      } else {
        setGameOver(true);
        onGameFailed();
      }
    }
  }, [board, solution, onGameComplete, onGameFailed]);

  // Handle cell selection
  const handleCellClick = (row, col) => {
    if (gameOver || gameWon) return;
    if (prefilled.includes(`${row}-${col}`)) return;
    
    setSelectedCell({ row, col });
  };

  // Handle number input
  const handleNumberInput = (num) => {
    if (!selectedCell || gameOver || gameWon) return;
    const { row, col } = selectedCell;
    
    if (prefilled.includes(`${row}-${col}`)) return;
    
    const newBoard = [...board];
    newBoard[row][col] = num;
    setBoard(newBoard);
    
    // Check if the number is valid
    const isValid = checkValid(row, col, num);
    const key = `${row}-${col}`;
    
    if (!isValid) {
      setInvalidCells(prev => [...prev, key]);
    } else {
      setInvalidCells(prev => prev.filter(cell => cell !== key));
    }
  };

  // Check if a number is valid in its position
  const checkValid = (row, col, num) => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === num) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && board[i][col] === num) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (r !== row || c !== col) {
          if (board[r][c] === num) {
            return false;
          }
        }
      }
    }
    
    return true;
  };

  // Clear the selected cell
  const clearCell = () => {
    if (!selectedCell || gameOver || gameWon) return;
    const { row, col } = selectedCell;
    
    if (prefilled.includes(`${row}-${col}`)) return;
    
    const newBoard = [...board];
    newBoard[row][col] = 0;
    setBoard(newBoard);
    
    // Remove from invalid cells if it was there
    const key = `${row}-${col}`;
    setInvalidCells(prev => prev.filter(cell => cell !== key));
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center sudoku-container">
      <div className="mb-4 text-xl font-bold">
        Time Left: <span className={timeLeft < 30 ? "text-error" : ""}>{formatTime(timeLeft)}</span>
      </div>
      
      <div className="sudoku-grid mb-6">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`sudoku-cell ${
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'selected' : ''
                } ${prefilled.includes(`${rowIndex}-${colIndex}`) ? 'prefilled' : ''} ${
                  invalidCells.includes(`${rowIndex}-${colIndex}`) ? 'invalid' : ''
                } bg-base-200 hover:bg-base-300`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className="btn btn-primary"
            onClick={() => handleNumberInput(num)}
            disabled={gameOver || gameWon}
          >
            {num}
          </button>
        ))}
        <button
          className="btn btn-secondary"
          onClick={clearCell}
          disabled={gameOver || gameWon}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SudokuBoard;
