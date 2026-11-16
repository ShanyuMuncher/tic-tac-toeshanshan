export function createBoard(size = 3) {
  return Array(size * size).fill('');
}

export function getGameStatus(board) {
  const size = Math.sqrt(board.length);

  // A flat array stores each row after the previous one.
  // Moving across a row adds 1; moving down a column adds size.
  function checkLine(start, step) {
    const player = board[start];
    if (!player) return false;

    for (let offset = 1; offset < size; offset++) {
      if (board[start + offset * step] !== player) return false;
    }
    return true;
  }

  function winResult(index) {
    return { currentPlayer: null, isGameOver: true, message: `Player ${board[index]} Wins!` };
  }

  for (let index = 0; index < size; index++) {
    if (checkLine(index * size, 1)) return winResult(index * size);
    if (checkLine(index, size)) return winResult(index);
  }

  // The two diagonals step down-right and down-left respectively.
  if (checkLine(0, size + 1)) return winResult(0);
  if (checkLine(size - 1, size - 1)) return winResult(size - 1);

  if (!board.includes('')) {
    return { currentPlayer: null, isGameOver: true, message: "It's a Tie!" };
  }

  const moveCount = board.filter(Boolean).length;
  const currentPlayer = moveCount % 2 === 0 ? 'X' : 'O';
  return { currentPlayer, isGameOver: false, message: `Player ${currentPlayer}'s Turn` };
}

export function playMove(board, index) {
  const { currentPlayer, isGameOver } = getGameStatus(board);
  if (isGameOver || board[index] !== '') {
    return board;
  }

  return board.map((cell, cellIndex) => cellIndex === index ? currentPlayer : cell);
}
