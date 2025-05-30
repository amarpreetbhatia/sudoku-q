import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faRedo, faSadTear } from '@fortawesome/free-solid-svg-icons';

const GameOver = ({ success, onRestart }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-base-100 p-6 md:p-8 rounded-lg shadow-lg text-center max-w-md w-full animate-fadeIn">
        {success ? (
          <>
            <FontAwesomeIcon icon={faTrophy} className="text-5xl md:text-6xl text-warning mb-4" bounce />
            <h2 className="text-xl md:text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="mb-6">You've successfully completed the Sudoku puzzle!</p>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faSadTear} className="text-5xl md:text-6xl text-info mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-4">Time's Up!</h2>
            <p className="mb-6">Give a new try, you are doing great!</p>
          </>
        )}
        
        <button 
          className="btn btn-primary btn-lg"
          onClick={onRestart}
        >
          <FontAwesomeIcon icon={faRedo} className="mr-2" />
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;