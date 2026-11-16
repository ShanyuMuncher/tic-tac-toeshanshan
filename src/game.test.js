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

for (const size of [3, 4, 5]) {
  test(`${size}x${size}: every complete row, column, and diagonal wins`, () => {
    const lines = [];
    for (let row = 0; row < size; row++) {
      lines.push(Array.from({ length: size }, (_, column) => row * size + column));
    }
    for (let column = 0; column < size; column++) {
      lines.push(Array.from({ length: size }, (_, row) => row * size + column));
    }
    lines.push(Array.from({ length: size }, (_, index) => index * size + index));
    lines.push(Array.from({ length: size }, (_, index) => index * size + size - 1 - index));

    for (const line of lines) {
      for (const player of ['X', 'O']) {
        const board = createBoard(size);
        assert.equal(board.length, size * size);
        line.forEach(index => { board[index] = player; });
        assert.equal(getGameStatus(board).message, `Player ${player} Wins!`);
        const emptyIndex = board.indexOf('');
        assert.equal(playMove(board, emptyIndex), board);
        // Removing one mark makes this an incomplete line.
        board[line[0]] = '';
        assert.equal(getGameStatus(board).isGameOver, false);
      }
    }
  });
}

test('larger full boards without a winning line are draws', () => {
  for (const rows of [
    ['XXOO', 'OOXX', 'XXOO', 'OOXX'],
    ['XXOOX', 'OOXXO', 'XXOOX', 'OOXXO', 'XOXOX'],
  ]) {
    const board = rows.join('').split('');
    assert.equal(getGameStatus(board).message, "It's a Tie!");
    assert.equal(playMove(board, 0), board);
  }
});

test('three marks on a larger board do not win, including across a row boundary', () => {
  for (const positions of [[0, 1, 2], [2, 3, 4], [0, 4, 8]]) {
    const board = createBoard(4);
    positions.forEach(index => { board[index] = 'X'; });
    assert.equal(getGameStatus(board).isGameOver, false);
  }
});

test('changing board size starts an empty game with X', () => {
  for (const size of [5, 4, 3]) {
    const board = createBoard(size);
    assert.equal(board.length, size * size);
    assert.ok(board.every(cell => cell === ''));
    assert.equal(getGameStatus(board).currentPlayer, 'X');
    assert.equal(playMove(board, size * size - 1)[size * size - 1], 'X');
  }
});
