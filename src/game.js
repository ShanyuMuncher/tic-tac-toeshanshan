const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function createBoard() {
  return Array(9).fill('');
}

export function getGameStatus(board) {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { currentPlayer: null, isGameOver: true, message: `Player ${board[a]} Wins!` };
    }
  }

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
