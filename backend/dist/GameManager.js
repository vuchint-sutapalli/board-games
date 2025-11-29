import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";
import { ChessLogic } from "./Logics/ChessLogic.js";
import { SnakeLadderLogic } from "./Logics/SnakeLadderLogic.js";
import { TicTacToeLogic } from "./Logics/TicTacToeLogic.js";
export class GameManager {
    games;
    pendingUsers; // Map gameType to pending user
    users;
    constructor() {
        this.games = [];
        this.pendingUsers = new Map();
        this.users = [];
    }
    addUser(user) {
        this.users.push(user);
        this.addHandler(user);
    }
    removeUser(user) {
        this.users = this.users.filter((u) => u !== user);
        // Find the game this user was in
        const game = this.games.find((game) => game.player1 === user || game.player2 === user);
        if (game) {
            // Notify the other player that their opponent disconnected
            const otherPlayer = game.player1 === user ? game.player2 : game.player1;
            otherPlayer.send(JSON.stringify({ type: GAME_OVER, payload: { winner: "draw" } }));
            this.games = this.games.filter((g) => g !== game);
        }
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            let message;
            try {
                message = JSON.parse(data.toString());
            }
            catch (e) {
                console.error("Invalid JSON received:", data.toString());
                return;
            }
            switch (message.type) {
                case INIT_GAME: {
                    const gameType = message.payload.game;
                    if (!gameType)
                        return;
                    const pendingUser = this.pendingUsers.get(gameType);
                    if (pendingUser) {
                        let gameLogic;
                        // Decide which game logic to use based on the type
                        if (gameType === "chess") {
                            gameLogic = new ChessLogic();
                        }
                        else if (gameType === "snake-ladder") {
                            gameLogic = new SnakeLadderLogic();
                        }
                        else if (gameType === "tictactoe") {
                            gameLogic = new TicTacToeLogic();
                        }
                        else {
                            // Here you would add: else if (gameType === 'tictactoe') { gameLogic = new TicTacToeLogic(); }
                            console.error(`Unsupported game type: ${gameType}`);
                            return;
                        }
                        // if a user is pending, start a new game
                        const game = new Game(pendingUser, socket, gameLogic);
                        this.games.push(game);
                        this.pendingUsers.set(gameType, null);
                    }
                    else {
                        this.pendingUsers.set(gameType, socket);
                    }
                    break;
                }
                case MOVE: {
                    const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                    if (game) {
                        // The type of 'message' is now narrowed to 'MoveMessage'
                        game.makeMove(socket, message.payload.move);
                    }
                    break;
                }
            }
        });
    }
}
//# sourceMappingURL=GameManager.js.map