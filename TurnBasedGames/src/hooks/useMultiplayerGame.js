import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "../SnackbarContext";
// import { useSnackbar } from "../context/SnackbarContext";

export function useMultiplayerGame(gameId, opponent) {
	const [player, setPlayer] = useState(null); // 'P1' or 'P2'
	const [turn, setTurn] = useState(null);
	const [message, setMessage] = useState("Waiting for another player...");
	const [boardState, setBoardState] = useState(null); // Generic board state
	const [gameConfig, setGameConfig] = useState(null); // For game-specific config like snakes/ladders
	const [winner, setWinner] = useState(null);
	const [lastMove, setLastMove] = useState(null); // Holds the payload of the last MOVE
	const ws = useRef(null);
	const { showSnackbar } = useSnackbar();

	// Use a ref to hold the latest player state to avoid stale closures in WebSocket callbacks
	const playerRef = useRef(player);
	useEffect(() => {
		playerRef.current = player;
	}, [player]);

	useEffect(() => {
		// if (opponent !== "human") return;

		const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
		if (!wsUrl) {
			console.error(
				"WebSocket URL not defined. Set VITE_WEBSOCKET_URL in .env file"
			);
			return;
		}

		ws.current = new WebSocket(wsUrl);

		ws.current.onopen = () => {
			console.log("WebSocket connected");
			ws.current.send(
				JSON.stringify({
					type: "INIT_GAME",
					payload: { game: gameId, opponent },
				})
			);
		};

		ws.current.onmessage = (event) => {
			let msg;
			try {
				msg = JSON.parse(event.data);
			} catch (error) {
				console.error("Received non-JSON message from server:", event.data);
				return;
			}

			switch (msg.type) {
				case "INIT_GAME":
					console.log("init game", JSON.stringify(msg.payload));
					setPlayer(msg.payload.player);
					setBoardState(msg.payload.board);
					setTurn("P1");
					setGameConfig(msg.payload); // Store the whole payload for specific configs
					showSnackbar(
						"Game started! You are " + msg.payload.player,
						"success"
					);
					break;
				case "MOVE":
					console.log(
						`message recieved from server, ${JSON.stringify(msg.payload)}`
					);

					setMessage(""); // Clear any previous messages
					setBoardState(msg.payload.board);
					setLastMove(msg.payload); // Store the entire move payload
					if (msg.payload.turn) {
						setTurn(msg.payload.turn);
					} else {
						setTurn((prev) => (prev === "P1" ? "P2" : "P1"));
					}
					break;
				case "GAME_OVER":
					console.log("game over", msg.payload.winner, playerRef.current);

					setWinner(msg.payload.winner);

					let winMsg;
					let snackbarType;

					if (msg.payload.winner === playerRef.current) {
						winMsg = "You won!";
						snackbarType = "success";
					} else if (msg.payload.winner === "OPPONENT_DISCONNECTED") {
						winMsg = "Opponent disconnected. You win!";
						snackbarType = "success";
					} else if (
						msg.payload.winner === null ||
						msg.payload.winner === undefined
					) {
						winMsg = "It's a draw!";
						snackbarType = "info";
					} else {
						winMsg = "You lost.";
						snackbarType = "error";
					}

					showSnackbar(`Game Over! ${winMsg}`, snackbarType);
					break;
				case "ERROR":
					console.error("Server Error:", msg.payload.message);
					showSnackbar(msg.payload.message, "error");
					break;
			}
		};

		return () => {
			if (ws.current) ws.current.close();
		};
	}, [gameId, opponent, showSnackbar]);

	const makeMove = (movePayload) => {
		// Add a guard clause to prevent sending invalid moves.
		if (winner) {
			showSnackbar("Game is over.", "error");
			return;
		}
		if (turn !== playerRef.current) {
			showSnackbar("It's not your turn.", "error");
			return;
		}

		if (ws.current) {
			ws.current.send(
				JSON.stringify({
					type: "MOVE",
					payload: {
						game: gameId,
						move: movePayload,
					},
				})
			);
		}
	};

	return {
		player,
		turn,
		message,
		boardState,
		gameConfig,
		winner,
		lastMove,
		makeMove,
	};
}
