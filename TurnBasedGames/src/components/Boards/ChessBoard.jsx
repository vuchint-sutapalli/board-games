import React, { useState, useMemo, useEffect } from "react";
import { Chess } from "chess.js";
import { useSnackbar } from "../../SnackbarContext";

const UNICODE_PIECES = {
	p: "♙",
	r: "♖",
	n: "♘",
	b: "♗",
	q: "♕",
	k: "♔",
	P: "♟",
	R: "♜",
	N: "♞",
	B: "♝",
	Q: "♛",
	K: "♚",
};

export default function ChessBoard({ fen, onMove, player, isMyTurn }) {
	const [selectedSquare, setSelectedSquare] = useState(null);
	const [validMoves, setValidMoves] = useState([]);
	const [boardVersion, setBoardVersion] = useState(0); // State to force re-renders
	const { showSnackbar } = useSnackbar();

	// Memoize the chess.js instance to avoid re-creating it on every render
	const chess = useMemo(() => new Chess(), []);

	// Keep the internal chess.js instance in sync with the FEN from the server
	useEffect(() => {
		try {
			chess.load(fen);
			// Force a re-render by updating a state variable after loading the new FEN
			setBoardVersion((v) => v + 1);
		} catch (e) {
			console.error("Invalid FEN received from server:", fen);
		}
	}, [fen, chess]);

	// Derive color from player prop. P1 is white, P2 is black.
	const playerColor = player === "P1" ? "white" : "black";

	const handleSquareClick = (square) => {
		if (!isMyTurn) {
			showSnackbar("It's not your turn!", "error");
			return;
		}

		// If a piece is already selected
		if (selectedSquare) {
			// Check if the new click is a valid move for the selected piece
			const isMoveValid = validMoves.some((move) => move.to === square);

			if (isMoveValid) {
				// Make the move
				onMove({ from: selectedSquare, to: square });
				setSelectedSquare(null);
				setValidMoves([]);
				return;
			}
		}

		// If no piece is selected, or the user clicks a different square
		const piece = chess.get(square);
		if (isMyTurn && piece && piece.color === playerColor[0]) {
			// Select the piece and get its valid moves
			setSelectedSquare(square);
			const moves = chess.moves({ square, verbose: true });
			setValidMoves(moves);
		} else {
			// Deselect if clicking an empty square or opponent's piece
			setSelectedSquare(null);
			setValidMoves([]);
		}
	};

	const board = chess.board();
	const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
	const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

	// Flip the board if the player is black
	const boardRanks = playerColor === "white" ? ranks : [...ranks].reverse();

	return (
		<div className="w-full max-w-xl aspect-square grid grid-cols-8 grid-rows-8 border-4 border-amber-800">
			{boardRanks.map((rank, rowIndex) => {
				const boardFiles =
					playerColor === "white" ? files : [...files].reverse();
				return boardFiles.map((file, colIndex) => {
					const square = `${file}${rank}`;
					const piece = chess.get(square);
					const isDarkSquare = (rowIndex + colIndex) % 2 === 1;

					const isSelected = selectedSquare === square;
					const isPossibleMove = validMoves.some((move) => move.to === square);

					return (
						<div
							key={square}
							onClick={() => handleSquareClick(square)}
							className={`flex items-center justify-center text-4xl sm:text-5xl cursor-pointer relative ${
								isDarkSquare ? "bg-amber-700" : "bg-amber-200"
							} ${isSelected ? "bg-green-500/70" : ""}`}
						>
							{piece && (
								<span
									className={piece.color === "w" ? "text-white" : "text-black"}
								>
									{UNICODE_PIECES[piece.type.toUpperCase()]}
								</span>
							)}
							{isPossibleMove && (
								<div className="absolute w-full h-full flex items-center justify-center">
									<div className="w-1/3 h-1/3 bg-green-500/50 rounded-full"></div>
								</div>
							)}
						</div>
					);
				});
			})}
		</div>
	);
}
