import { useState, useEffect, useRef } from "react";
import GameEngine from "../engine/GameEngine";
import AIPlayer from "../engine/AIPlayer";
import TicTacToeBoard from "../engine/TicTacToeBoard";
import SnakeAndLaddersBoard from "../engine/SNLBoard";

function playSound(type, soundOn) {
	if (!soundOn) return;
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.connect(g);
		g.connect(ctx.destination);
		if (type === "win") {
			o.frequency.value = 880;
			g.gain.value = 0.03;
		} else if (type === "lose") {
			o.frequency.value = 220;
			g.gain.value = 0.03;
		} else {
			o.frequency.value = 440;
			g.gain.value = 0.02;
		}
		o.start();
		setTimeout(() => {
			o.stop();
			ctx.close();
		}, 120);
	} catch (e) {}
}

export function useGame(gameType, mode, playerMark, soundOn) {
	const [engine, setEngine] = useState(
		() => new GameEngine(new TicTacToeBoard(), ["X", "O"])
	);
	const [diceRoll, setDiceRoll] = useState(null);
	const [ai] = useState(() => new AIPlayer(playerMark === "X" ? "O" : "X"));
	const [boardState, setBoardState] = useState(engine.getBoard().cells);
	const [animateKey, setAnimateKey] = useState(0);
	const lastMoveRef = useRef(null);

	// WebSocket connection management
	useEffect(() => {
		if (mode !== "human-vs-human") {
			return;
		}

		const ws = new WebSocket("ws://localhost:8080");

		ws.onopen = () => {
			console.log("WebSocket connected");
			// Send the game type to the server to initiate pairing
			ws.send(
				JSON.stringify({
					type: "INIT_GAME",
					payload: {
						game: gameType,
					},
				})
			);
		};

		ws.onmessage = (event) => {
			// Handle incoming messages from the server (e.g., moves from the opponent)
			console.log("Message from server: ", event.data);
		};

		// Cleanup on unmount
		return () => ws.close();
	}, [gameType, mode]);

	// Effect to initialize or switch the game engine
	useEffect(() => {
		if (gameType === "tic-tac-toe") {
			setEngine(new GameEngine(new TicTacToeBoard(), ["X", "O"]));
		} else if (gameType === "snake-and-ladders") {
			setEngine(new GameEngine(new SnakeAndLaddersBoard(), ["P1", "P2"]));
		}
	}, [gameType]);

	// Effect for game logic (winner check, AI moves)
	useEffect(() => {
		const board = engine.getBoard();
		const winner = board.winner();
		setBoardState(board.cells);

		if (winner) {
			playSound(winner.mark === playerMark ? "win" : "lose", soundOn);
		} else if (board.isGameOver()) {
			playSound("tie", soundOn);
		}

		if (
			gameType === "tic-tac-toe" &&
			mode === "human-vs-ai" &&
			!winner &&
			engine.turn === ai.mark
		) {
			const timer = setTimeout(() => {
				const bestMove = ai.findBestMove(board);
				if (bestMove !== null) {
					engine.makeMove({ index: bestMove });
					lastMoveRef.current = bestMove;
					setBoardState(engine.getBoard().cells);
					setAnimateKey((k) => k + 1);
				}
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [engine, engine.history.length, mode, playerMark, ai, gameType, soundOn]);

	// --- Event Handlers ---
	const handleCellClick = (i) => {
		if (engine.getBoard().winner()) return;
		if (mode === "human-vs-ai" && engine.turn !== playerMark) return;
		try {
			if (engine.makeMove({ index: i })) {
				lastMoveRef.current = i;
				setAnimateKey((k) => k + 1);
			}
		} catch (e) {
			console.warn(e);
		}
	};

	const handleDiceRoll = () => {
		if (engine.getBoard().winner()) return;
		const roll = Math.floor(Math.random() * 6) + 1;
		setDiceRoll(roll);
		if (engine.makeMove({ roll })) {
			setAnimateKey((k) => k + 1);
		}
	};

	const handleUndo = () => engine.undo();
	const handleRedo = () => engine.redo();
	const handleReset = () => {
		engine.reset();
		lastMoveRef.current = null;
		setAnimateKey((k) => k + 1);
	};
	const handleJumpTo = (i) => {
		engine.current = i;
		setBoardState(engine.getBoard().cells);
	};

	return {
		engine,
		boardState,
		diceRoll,
		animateKey,
		lastMoveRef,
		handleCellClick,
		handleDiceRoll,
		handleUndo,
		handleRedo,
		handleReset,
		handleJumpTo,
	};
}
