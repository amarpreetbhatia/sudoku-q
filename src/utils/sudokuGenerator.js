// Function to generate a solved Sudoku board
const generateSolvedSudoku = () => {
  // Start with an empty 9x9 grid
  const board = Array(9).fill().map(() => Array(9).fill(0));
  
  // Solve the board
  if (solveSudoku(board)) {
    return board;
  }
  return null; // In case solving fails
};

// Backtracking algorithm to solve Sudoku
const solveSudoku = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Find an empty cell
      if (board[row][col] === 0) {
        // Try placing numbers 1-9
        const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            
            if (solveSudoku(board)) {
              return true;
            }
            
            // If placing the number doesn't lead to a solution, backtrack
            board[row][col] = 0;
          }
        }
        return false; // No valid number found
      }
    }
  }
  return true; // All cells filled
};

// Check if placing a number at a position is valid
const isValid = (board, row, col, num) => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
  
  // Check column
  for (let y = 0; y < 9; y++) {
    if (board[y][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (board[boxRow + y][boxCol + x] === num) return false;
    }
  }
  
  return true;
};

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Create a puzzle by removing numbers from a solved board
const generatePuzzle = (difficulty = 'medium') => {
  const solvedBoard = generateSolvedSudoku();
  if (!solvedBoard) return null;
  
  // Create a copy of the solved board
  const puzzle = solvedBoard.map(row => [...row]);
  
  // Define how many cells to remove based on difficulty
  let cellsToRemove;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 40; // 41 clues remain
      break;
    case 'medium':
      cellsToRemove = 50; // 31 clues remain
      break;
    case 'hard':
      cellsToRemove = 55; // 26 clues remain
      break;
    default:
      cellsToRemove = 50;
  }
  
  // Remove cells randomly
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  
  return {
    puzzle,
    solution: solvedBoard
  };
};

// Check if a puzzle is valid
const isValidSudoku = (board) => {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const rowSet = new Set();
    for (let col = 0; col < 9; col++) {
      const val = board[row][col];
      if (val !== 0) {
        if (rowSet.has(val)) return false;
        rowSet.add(val);
      }
    }
  }
  
  // Check columns
  for (let col = 0; col < 9; col++) {
    const colSet = new Set();
    for (let row = 0; row < 9; row++) {
      const val = board[row][col];
      if (val !== 0) {
        if (colSet.has(val)) return false;
        colSet.add(val);
      }
    }
  }
  
  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const boxSet = new Set();
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const val = board[boxRow * 3 + row][boxCol * 3 + col];
          if (val !== 0) {
            if (boxSet.has(val)) return false;
            boxSet.add(val);
          }
        }
      }
    }
  }
  
  return true;
};

// Check if the board is completely filled
const isBoardComplete = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return false;
    }
  }
  return true;
};

export { generatePuzzle, isValidSudoku, isBoardComplete };
