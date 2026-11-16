import assert from 'node:assert/strict';
import test from 'node:test';
import { createBoard, getGameStatus, playMove } from './game.js';

function playSequence(moves) {
  return moves.reduce(playMove, createBoard());
}

test('a new game starts empty with X, and moves alternate without mutating the board', () => {
  const board = createBoard();
  assert.deepEqual(board, Array(9).fill(''));
  assert.equal(getGameStatus(board).message, "Player X's Turn");
  const nextBoard = playMove(board, 0);
  assert.equal(board[0], '');
  assert.equal(nextBoard[0], 'X');
  assert.equal(getGameStatus(nextBoard).message, "Player O's Turn");
  assert.equal(playMove(nextBoard, 1)[1], 'O');
});

test('an occupied square cannot be overwritten or advance the turn', () => {
  const board = playSequence([0]);
  assert.equal(playMove(board, 0), board);
  assert.equal(getGameStatus(board).currentPlayer, 'O');
});

test('every winning line is detected for either player', () => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const line of lines) {
    for (const player of ['X', 'O']) {
      const board = createBoard();
      line.forEach(index => { board[index] = player; });
      assert.deepEqual(getGameStatus(board), {
        currentPlayer: null,
        isGameOver: true,
        message: `Player ${player} Wins!`,
      });
    }
  }
});

test('a win stops further moves', () => {
  const board = playSequence([0, 3, 1, 4, 2]);
  assert.equal(getGameStatus(board).message, 'Player X Wins!');
  assert.equal(playMove(board, 5), board);
});

test('a full board without a winner is a tie and stops further moves', () => {
  const board = playSequence([0, 1, 2, 4, 3, 5, 7, 6, 8]);
  assert.deepEqual(getGameStatus(board), {
    currentPlayer: null,
    isGameOver: true,
    message: "It's a Tie!",
  });
  assert.equal(playMove(board, 0), board);
});

test('a winning ninth move is a win, not a tie', () => {
  const board = playSequence([0, 1, 2, 3, 4, 5, 7, 6, 8]);
  assert.equal(getGameStatus(board).message, 'Player X Wins!');
});

test('restarting produces a fresh empty board with X to play', () => {
  const finishedBoard = playSequence([0, 3, 1, 4, 2]);
  const restartedBoard = createBoard();
  assert.notEqual(restartedBoard, finishedBoard);
  assert.equal(restartedBoard.every(cell => cell === ''), true);
  assert.equal(getGameStatus(restartedBoard).isGameOver, false);
  assert.equal(getGameStatus(restartedBoard).currentPlayer, 'X');
});
