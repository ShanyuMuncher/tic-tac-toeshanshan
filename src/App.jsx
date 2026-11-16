import { useState } from 'react';
import { createBoard, getGameStatus, playMove } from './game.js';

function Board({ board, isGameOver, onPlay }) {
  return (
    <div id="board" className="board" role="group" aria-label="Tic-tac-toe board">
      {board.map((cell, index) => (
        <button
          key={index}
          type="button"
          className={`cell${cell ? ` taken ${cell.toLowerCase()}` : ''}`}
          aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: ${cell || 'empty'}`}
          disabled={Boolean(cell) || isGameOver}
          onClick={() => onPlay(index)}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [board, setBoard] = useState(createBoard);
  const { isGameOver, message } = getGameStatus(board);

  function handlePlay(index) {
    setBoard(currentBoard => playMove(currentBoard, index));
  }

  function restartGame() {
    setBoard(createBoard());
  }

  return (
    <div className="container">
      <header>
        <h1>Tic-Tac-Toe</h1>
      </header>

      <section className="status-panel" aria-label="Game status and controls">
        <div id="status-message" className="status-message" role="status">
          {message}
        </div>
        <button id="reset-btn" type="button" className="btn" onClick={restartGame}>
          Restart Game
        </button>
      </section>

      <main className="board-container">
        <Board board={board} isGameOver={isGameOver} onPlay={handlePlay} />
      </main>
    </div>
  );
}
