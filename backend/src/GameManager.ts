import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";
import type { IGameLogic } from "./Logics/IGameLogic.js";
import { ChessLogic } from "./Logics/ChessLogic.js";
import { SnakeLadderLogic } from "./Logics/SnakeLadderLogic.js";
import { TicTacToeLogic } from "./Logics/TicTacToeLogic.js";
import { PLAYER_LEFT } from "./messages.js";
interface InitGameMessage {
	type: typeof INIT_GAME;
	payload: {
		game: string;
		opponent?: "human" | "bot";
	};
}

interface MoveMessage {
	type: typeof MOVE;
	payload: {
		game: string;
		move: any; // Make move payload generic
	};
}

export class GameManager {
	private games: Game[];
	private pendingUsers: Map<string, WebSocket | null>; // Map gameType to pending user

	private users: WebSocket[];

	constructor() {
		this.games = [];
		this.pendingUsers = new Map();
		this.users = [];
	}

	addUser(user: WebSocket) {
		this.users.push(user);

		this.addHandler(user);
	}
	removeUser(user: WebSocket) {
		this.users = this.users.filter((u) => u !== user);
		// Find the game this user was in
		const game = this.games.find(
			(game) => game.player1 === user || game.player2 === user
		);
		if (game) {
			// Notify the other player that their opponent disconnected
			const otherPlayer = game.player1 === user ? game.player2 : game.player1;
			// Only send a message if the other player is a human connected via WebSocket
			if (otherPlayer instanceof WebSocket) {
				if (game.isGameOver()) {
					// If the game is already over, just notify that the opponent left.
					otherPlayer.send(
						JSON.stringify({
							type: PLAYER_LEFT,
							payload: { message: "Your opponent has left." },
						})
					);
				} else {
					// If the game is in progress, end it and declare the other player the winner.
					const winnerIdentifier = game.player1 === otherPlayer ? "P1" : "P2";
					// Mark the game object with the winner for consistency.
					game.forceWinner(winnerIdentifier);

					otherPlayer.send(
						JSON.stringify({
							type: GAME_OVER,
							payload: {
								winner: winnerIdentifier,
								reason: "OPPONENT_DISCONNECTED",
							},
						})
					);
				}
			}
			this.games = this.games.filter((g) => g !== game);
		}
	}

	private addHandler(socket: WebSocket) {
		socket.on("message", (data) => {
			let message: InitGameMessage | MoveMessage;
			try {
				message = JSON.parse(data.toString());
			} catch (e) {
				console.error("Invalid JSON received:", data.toString());
				return;
			}

			switch (message.type) {
				case INIT_GAME: {
					const gameType = message.payload.game;
					const opponentType = message.payload.opponent ?? "human";
					if (!gameType) return;

					let gameLogic: IGameLogic;
					// Decide which game logic to use based on the type
					if (gameType === "chess") {
						gameLogic = new ChessLogic();
					} else if (gameType === "snake-ladder") {
						gameLogic = new SnakeLadderLogic();
					} else if (gameType === "tictactoe") {
						gameLogic = new TicTacToeLogic();
					} else {
						console.error(`Unsupported game type: ${gameType}`);
						return;
					}

					if (opponentType === "bot") {
						// If the user wants to play against a bot, create the game immediately.
						// The Game constructor will handle creating the AIPlayer.
						if (gameType === "tictactoe") {
							const game = new Game(socket, null, gameLogic);
							console.log(
								"createing a new tic tac toe game with bot as opponent"
							);

							this.games.push(game);
							// Manually send the INIT_GAME message now that the game is created
							socket.send(
								JSON.stringify({
									type: INIT_GAME,
									payload: gameLogic.getInitialPayload("P1"),
								})
							);
						} else {
							// You can add AI support for other games here later
							console.error(`Bot not implemented for ${gameType}`);
							return;
						}
					} else {
						// Handle human vs human matchmaking
						const pendingUser = this.pendingUsers.get(gameType);
						if (pendingUser) {
							const game = new Game(pendingUser, socket, gameLogic);
							this.games.push(game);
							// Notify both players that the game has started
							pendingUser.send(
								JSON.stringify({
									type: INIT_GAME,
									payload: gameLogic.getInitialPayload("P1"),
								})
							);
							socket.send(
								JSON.stringify({
									type: INIT_GAME,
									payload: gameLogic.getInitialPayload("P2"),
								})
							);
							this.pendingUsers.set(gameType, null);
						} else {
							this.pendingUsers.set(gameType, socket);
						}
					}
					break;
				}
				case MOVE: {
					const game = this.games.find(
						(game) => game.player1 === socket || game.player2 === socket
					);

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
