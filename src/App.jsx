import { useState } from 'react';
import { createBoard, getGameStatus, playMove } from './game.js';

function Board({ board, size, isGameOver, onPlay }) {
  return (
    <div id="board" className="board" style={{ '--board-size': size }} role="group" aria-label={`${size} by ${size} Tic-tac-toe board`}>
      {board.map((cell, index) => (
        <button
          key={index}
          type="button"
          className={`cell${cell ? ` taken ${cell.toLowerCase()}` : ''}`}
          aria-label={`Row ${Math.floor(index / size) + 1}, column ${index % size + 1}: ${cell || 'empty'}`}
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
  const size = Math.sqrt(board.length);
  const { isGameOver, message } = getGameStatus(board);

  function handlePlay(index) {
    setBoard(currentBoard => playMove(currentBoard, index));
  }

  function restartGame() {
    setBoard(createBoard(size));
  }

  function changeSize(event) {
    // Starting a fresh board also resets the turn and game result.
    setBoard(createBoard(Number(event.target.value)));
  }

  return (
    <div className="container">
      <header>
        <h1>Tic-Tac-Toe</h1>
      </header>

      <section className="status-panel" aria-label="Game status and controls">
        <div className="size-control">
          <label htmlFor="board-size">Board size</label>
          <select id="board-size" value={size} onChange={changeSize} aria-describedby="size-help">
            {[3, 4, 5].map(option => (
              <option key={option} value={option}>{option} × {option}</option>
            ))}
          </select>
        </div>
        <p id="size-help" className="rules">Changing size starts a new game. Match {size} across a full row, column, or diagonal to win.</p>
        <div id="status-message" className="status-message" role="status">
          {message}
        </div>
        <button id="reset-btn" type="button" className="btn" onClick={restartGame}>
          Restart Game
        </button>
      </section>

      <main className="board-container">
        <Board board={board} size={size} isGameOver={isGameOver} onPlay={handlePlay} />
      </main>
    </div>
  );
}
