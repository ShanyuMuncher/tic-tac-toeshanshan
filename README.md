# Tic-Tac-Toe

A two-player tic-tac-toe game built with React and Vite. X starts each game.
Players alternate until someone wins or the board is full. Restart Game clears
the board and starts a new game.

## Run locally

Use Node.js 22.12+ or 24+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal. The app now uses a development
server; opening `index.html` directly is no longer supported.

```sh
npm test          # Check game rules
npm run build    # Create the production site in dist/
npm run preview  # Preview the production build locally
```

## Files

- `src/App.jsx`: React components, board state, and event handlers.
- `src/game.js`: Pure functions for moves, turns, wins, and ties.
- `src/main.jsx`: React entry point and stylesheet import.
- `styles.css`: Original design with keyboard focus and responsive sizing.

The board is the only stored game state. The current player and game result
are derived from it, and React renders each update. Squares are native buttons
for keyboard play, and the game status is announced to screen readers.
