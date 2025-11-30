import type { IGameLogic } from "./Logics/IGameLogic.js";
import { WebSocket } from "ws";
import { GAME_OVER, MOVE, INIT_GAME } from "./messages.js";
import AIPlayer from "./AiPlayer.js";

export class Game {
	public player1: WebSocket;
	public player2: WebSocket | AIPlayer | null;

	private gameLogic: IGameLogic;
	private startTime: Date;
	private turn: "P1" | "P2"; // Keep track of whose turn it is

	constructor(
		user1: WebSocket,
		user2: WebSocket | null,
		gameLogic: IGameLogic
	) {
		this.player1 = user1;
		this.player2 = user2 ?? new AIPlayer("P2"); // If user2 is null, create an AI Player
		this.gameLogic = gameLogic;
		this.startTime = new Date();
		this.turn = "P1"; // Player 1 starts
	}

	async makeMove(player: WebSocket, move: any) {
		const playerIdentifier = this.getPlayerIdentifier(player);

		// Validate that it's the correct player's turn
		if (this.turn !== playerIdentifier) {
			// Send a structured error message back to the client
			// This check is primarily for human players
			if (player instanceof WebSocket) {
				player.send(
					JSON.stringify({
						type: "ERROR",
						payload: { message: "Not your turn" },
					})
				);
				return;
			}
		}

		let moveResult;
		try {
			moveResult = this.gameLogic.makeMove(move, playerIdentifier);
		} catch (error) {
			// If the move is invalid, the logic will throw an error.
			console.error("Invalid move:", error);
			return;
		}

		// --- Core Change for Chain Reactions ---
		// Only switch turns if the game logic says the turn is over.
		// For a simple game, `isTurnOver` will always be true.
		// For a chain reaction game, it might be false, waiting for another move from the same player
		// or for an automatic cascade to be processed. We default to `true` for
		// backward compatibility with simple game logics.
		const isTurnOver = moveResult.isTurnOver ?? true;

		// Determine whose turn it will be next and get their identifier
		const nextTurnIdentifier = isTurnOver
			? this.turn === "P1"
				? "P2"
				: "P1"
			: this.turn;

		// Broadcast the result of the move, now including whose turn it is next
		this.broadcast({
			type: MOVE,
			payload: { ...moveResult.payload, turn: nextTurnIdentifier },
		});

		// Check for game over after the human move
		if (moveResult.isGameOver ?? this.gameLogic.isGameOver()) {
			const winner = moveResult.winner;
			this.broadcast({
				type: GAME_OVER,
				payload: {
					winner: winner,
					time: new Date().getTime() - this.startTime.getTime(),
				},
			});
			return; // Game is over, no more moves
		}

		if (isTurnOver) {
			this.turn = nextTurnIdentifier;

			// If it's now the AI's turn, trigger its move
			if (this.player2 instanceof AIPlayer && this.turn === "P2") {
				// Use a small delay to make the AI's move feel more natural
				await new Promise((resolve) => setTimeout(resolve, 500));
				this.makeAIMove();
			}
		}
	}

	private makeAIMove() {
		if (!(this.player2 instanceof AIPlayer) || this.turn !== "P2") {
			return;
		}
		console.log("aiiii");

		const aiMove = this.player2.findBestMove(this.gameLogic.getBoard());
		console.log("ai is trying to make a move", aiMove);

		if (aiMove === null) return; // No available moves

		console.log(`best move found, ${aiMove}`);

		const moveResult = this.gameLogic.makeMove({ index: aiMove }, "P2");
		const nextTurnIdentifier = "P1"; // After AI moves, it's always P1's turn

		this.broadcast({
			type: MOVE,
			payload: { ...moveResult.payload, turn: nextTurnIdentifier },
		});

		if (moveResult.isGameOver ?? this.gameLogic.isGameOver()) {
			const winner = moveResult.winner;
			this.broadcast({
				type: GAME_OVER,
				payload: {
					winner: winner,
					time: new Date().getTime() - this.startTime.getTime(),
				},
			});
			// No need to set turn, the game is over. We can just return.
			return;
		} else {
			this.turn = "P1";
		}
	}

	private broadcast(message: object) {
		const moveMessage = JSON.stringify(message);
		this.player1.send(moveMessage);
		if (this.player2 instanceof WebSocket) {
			this.player2.send(moveMessage);
		}
	}

	private getPlayerIdentifier(player: WebSocket): "P1" | "P2" {
		return player === this.player1 ? "P1" : "P2"; // Assumes player2 is never the one sending a WebSocket message in an AI game
	}

	public isGameOver(): boolean {
		return this.gameLogic.isGameOver();
	}

	public forceWinner(player: "P1" | "P2"): void {
		if (this.gameLogic.forceWinner) {
			this.gameLogic.forceWinner(player);
		}
	}
}
