# Turn-Based Board Games Platform

This project is a real-time, web-based platform for playing classic turn-based games. It features a modern frontend built with React and a scalable WebSocket backend powered by Node.js.

## Live Demo

- **Frontend (Vercel):** [https://board-games-zeta.vercel.app/](https://board-games-zeta.vercel.app/)
- **Backend (Railway):** `wss://board-games-production.up.railway.app`

---

## Tech Stack

| Area         | Technology                                     |
| :----------- | :--------------------------------------------- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS          |
| **Backend**  | Node.js, TypeScript, WebSockets (`ws` library) |
| **Hosting**  | Vercel (Frontend), Railway (Backend)           |

---

## Project Structure

The repository is structured as a monorepo with two main packages:

```
/
├── TurnBasedGames/  # React frontend application
└── backend/         # Node.js WebSocket server
```

### Frontend (`TurnBasedGames`)

This is a React application built with Vite that serves as the user interface for the games.

#### Key Routes

- `GET /`

  - **Component:** `<Landing />`
  - **Description:** The main landing page where users can select a game to play.

- `GET /play/:gameType`

  - **Component:** `<GamePage />`
  - **Description:** The multiplayer game screen. It uses the `useMultiplayerGame` hook to establish a WebSocket connection with the backend and manage real-time game state. `:gameType` is a dynamic parameter (e.g., `chess`, `tictactoe`).

- `GET /local/:gameType`
  - **Component:** `<App />`
  - **Description:** A route for playing a local, pass-and-play version of a game without a server connection.

#### Running Locally

1.  Navigate to the frontend directory:
    ```bash
    cd TurnBasedGames
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.development` file in the `TurnBasedGames` root and add the local backend URL:
    ```
    VITE_WEBSOCKET_URL=ws://localhost:8080
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

#### Frontend Architecture

The frontend is built with a focus on component reusability and separation of concerns, making it simple to add new games.

##### Core Components & Hooks

- **`<GamePage />`:** This component acts as the main container for a multiplayer game session. It uses the `gameType` from the URL to determine which game to render and is responsible for fetching and displaying the game board and UI elements.

- **`useMultiplayerGame` Hook:** This is the core of the real-time functionality. It abstracts away the complexities of WebSocket communication.

  - It establishes and maintains the WebSocket connection to the backend.
  - It listens for incoming messages from the server (e.g., `init`, `update`, `gameover`) and updates the local game state accordingly.
  - It provides a simple `makeMove` function that UI components can call to send a move to the server.
  - It exposes the current game state, player color, and other relevant data to the component that uses it.

- **Game Board Components (e.g., `<ChessBoard />`, `<TicTacToeBoard />`):** These are specialized components responsible for rendering the visual representation of a specific game. They receive the game state and move handlers as props from `<GamePage />` and are not directly aware of the WebSocket connection.

##### How to Add a New Game (Frontend)

Adding a new game to the user interface follows a clear pattern:

1.  **Create the Board Component:**

    - Develop a new React component for the game (e.g., `CheckersBoard.tsx`).
    - This component will take props like the board state (e.g., a 2D array) and a function to handle moves (e.g., `onMove`). It will be responsible for rendering the board and handling user input, like clicking on squares.

2.  **Integrate into `<GamePage />`:**

    - In the `<GamePage />` component, add a case to the logic that renders the correct board component based on the `:gameType` URL parameter.

3.  **Add to the Landing Page:**
    - Update the `<Landing />` component to include a link or button for the new game, pointing to its multiplayer route (e.g., `/play/checkers`).

### Backend (`backend`)

This is a Node.js WebSocket server responsible for managing game logic, player connections, and broadcasting game state updates.

#### Running Locally

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the server:
    ```bash
    npm run build
    npm run start
    ```
    The server will start and listen on `ws://localhost:8080`.

#### Backend Architecture

The backend is designed with a modular and extensible architecture, making it straightforward to add new games without altering the core server logic. This is achieved by separating connection management from game-specific logic.

##### Core Components

- **WebSocket Server (`src/index.ts`):** This is the server's entry point. It handles incoming WebSocket connections, manages client sessions, and routes messages to the appropriate game instances. It is responsible for pairing players and instantiating game rooms.

- **Game Manager:** A central component that oversees all active game sessions. When players are matched, the manager creates a new instance of the requested game (e.g., `TicTacToeGame`, `ChessGame`) and associates it with the players' connections.

- **Game Logic Abstraction:** To ensure consistency and enable extensibility, all games implement a common interface or extend a base class. This contract defines a standard way for the server to interact with any game, including methods for handling moves, managing state, and checking game-over conditions.

##### How to Add a New Game

Adding a new game is a streamlined process:

1.  **Create a Game Logic Class:**

    - Create a new file under a `games/` directory (e.g., `games/checkers.ts`).
    - Implement the game's logic inside a class (e.g., `CheckersGame`) that adheres to the common game interface. This includes managing the board state, validating moves, and determining win/loss/draw conditions.

2.  **Define Message Types:**

    - Establish the specific message types the new game will handle (e.g., `{ type: 'move', from: 'a1', to: 'b2' }`).
    - The game class will contain the logic to process these messages and update its state accordingly.

3.  **Register the New Game:**
    - Import the new game class into the main Game Manager.
    - Add it to the map or factory that associates a `gameType` string (like `"checkers"`) with its corresponding game class.

Once registered, the core server can create and manage instances of the new game without any further modifications. The frontend can then add a route like `/play/checkers` to allow users to play it.

---

## Deployment

This project uses a decoupled hosting strategy for optimal performance and scalability.

- **Frontend (Vercel):** The `TurnBasedGames` directory is linked to a Vercel project. On every `git push`, Vercel automatically runs `npm run build` and deploys the static output from the `dist` folder to its global Edge Network. The production WebSocket URL is configured as a `VITE_WEBSOCKET_URL` environment variable in Vercel's project settings.

- **Backend (Railway):** The `backend` directory is linked to a Railway project. Railway uses the `build` and `start` scripts from `package.json` to build the TypeScript code and run the server. It automatically assigns a `PORT` environment variable and exposes the service to the internet.
