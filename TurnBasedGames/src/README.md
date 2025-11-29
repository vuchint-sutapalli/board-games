# Tic-Tac-Toe OOP + React

This project is a modern implementation of the classic Tic-Tac-Toe game, built with a clean, object-oriented core logic and a reactive user interface powered by React. It serves as an excellent example of separating stateful game logic from the presentation layer.

The game supports different modes, including a challenging Human-vs-AI mode where the computer uses the minimax algorithm for optimal play.

## Features

- **Multiple Game Modes**: Play against another human or challenge the AI.
- **Intelligent AI Opponent**: The AI uses the minimax algorithm with alpha-beta pruning to ensure it plays optimally.
- **Undo/Redo**: Step backward and forward through the game's move history.
- **Persistent State**: Game mode, player preferences, and scores are saved to `localStorage`, so they persist between sessions.
- **Interactive History**: View the list of moves and click on any past move to see the state of the board at that point.
- **Sound Effects**: Audio feedback for win, lose, and tie game events.
- **Responsive UI**: A clean and modern interface that works on different screen sizes.

## Tech Stack

- **Core Logic**: Plain JavaScript (ES6+ Classes)
- **Frontend**: React
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Architecture

The project is intentionally designed with a strong separation of concerns. The core game logic is encapsulated within plain JavaScript classes, making it independent of the React UI. This makes the logic reusable, testable, and easier to reason about.

### Directory Structure

```
src/
├── components/   # React components for the UI (Board, ScorePanel, etc.)
├── engine/       # Core OOP game logic classes
│   ├── AIPlayer.js
│   ├── Board.js
│   └── GameEngine.js
├── App.jsx       # Main React component that bridges the engine and the UI
└── main.tsx      # Application entry point
```

### Core Engine Classes (`src/engine/`)

The engine is the heart of the game and operates without any knowledge of React.

- **`Board.js`**: Represents a single 3x3 game board.

  - Manages the state of the 9 cells.
  - Provides methods to make a move (`makeMove`), check for a winner (`winner`), and find available moves.
  - Includes a `clone()` method to support immutability, which is crucial for the history feature.

- **`GameEngine.js`**: Acts as the main controller for the game session.

  - Manages the game's `history` as an array of `Board` states.
  - Tracks the current turn (`X` or `O`) and scores.
  - Provides public methods for the UI to call: `makeMove()`, `undo()`, `redo()`, and `reset()`.
  - It ensures game rules are followed and updates scores when a game ends.

- **`AIPlayer.js`**: Encapsulates the logic for the computer opponent.
  - Its primary method, `findBestMove()`, takes a `Board` object as input.
  - It implements the **minimax algorithm** (with alpha-beta pruning) to recursively evaluate all possible moves and return the one that leads to the best outcome.

### React Components (`src/App.jsx` and `src/components/`)

The UI is built with React and is responsible for rendering the game state and capturing user input.

- **`App.jsx`**: The top-level component.

  - Initializes and holds instances of `GameEngine` and `AIPlayer`.
  - Uses React's `useState` and `useEffect` hooks to manage the application's state.
  - When a player clicks a cell, it calls the appropriate method on the `GameEngine` instance.
  - It then reads the new state from the engine and re-renders the UI components.
  - Orchestrates the AI's turn by calling `ai.findBestMove()` and then `engine.makeMove()`.

- **`components/*`**: Dumb/presentational components that receive props and render a piece of the UI. For example, the `Board` component receives the `cells` array and a `onCellClick` handler.

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

You need to have Node.js and npm (or yarn/pnpm) installed.

### Installation & Running

1.  **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```

This will start the Vite development server, and you can view the application by navigating to `http://localhost:5173` (or the port specified in your terminal).

## How It Works: The Game Loop

1.  **User Action**: A player clicks on a cell. The `onCellClick` handler in the `Board` component is triggered.
2.  **State Update**: This calls `handleCellClick` in `App.jsx`, which in turn calls `engine.makeMove(index)`.
3.  **Engine Logic**: `GameEngine` validates the move, creates a new `Board` state, adds it to its `history` array, updates the turn, and checks for a winner.
4.  **React Re-render**: The `useEffect` hook in `App.jsx`, which depends on the engine's state, runs. It gets the latest board state from `engine.board.cells` and updates the React state via `setBoardState()`, causing the UI to re-render.
5.  **AI's Turn**: If it's the AI's turn, the `useEffect` hook calls `ai.findBestMove()`. After a short delay, the returned move is passed to `engine.makeMove()`, and the loop repeats from step 3.

This cycle ensures a clean data flow where React is only responsible for reflecting the state of the powerful, underlying game engine.

---

This README should provide a solid foundation for any developer joining the project.
