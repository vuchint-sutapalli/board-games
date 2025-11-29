import React, { useEffect, useMemo, useRef, useState } from "react";
import boardImage from "../../assets/snakesandladders.png";

// Moved outside the component: This is now a pure helper function.
// It's not part of the component's render cycle, so it can't cause re-renders.
const generateZigZagBoard = (size) => {
	const orderedCells = [];
	const numRows = Math.sqrt(size);
	for (let i = 1; i <= numRows; i++) {
		const row = [];
		const start = (i - 1) * numRows + 1;
		const end = i * numRows;
		for (let j = start; j <= end; j++) {
			row.push(j); // 1-indexed cell number
		}
		if ((numRows - i) % 2 === 1) {
			row.reverse();
		}
		orderedCells.push(...row);
	}
	return orderedCells.reverse(); // Board starts from bottom-left (1)
};

export default function SnakesAndLaddersBoard({
	playerPositions, // { P1: 25, P2: 10 }
	snakes, // [[start, end], ...]
	ladders, // [[start, end], ...]
	size = 100,
}) {
	const boardRef = useRef(null);
	const [cellCoordinates, setCellCoordinates] = useState({}); // { 1: { x: 0, y: 0 }, ... }
	const [boardWidth, setBoardWidth] = useState(0);

	// Generate the board in the correct zigzag order
	const orderedBoardCells = useMemo(() => generateZigZagBoard(size), [size]); // [1, 2, ..., 100] in visual order

	// Calculate cell coordinates on mount and resize
	useEffect(() => {
		if (!boardRef.current) return;

		const calculateCoordinates = () => {
			const boardElement = boardRef.current;
			const { width, height } = boardElement.getBoundingClientRect();
			setBoardWidth(width); // Store the current width

			// Use responsive padding. Tailwind's 'md' breakpoint is 768px.
			// We check the board's actual width. If it's less than 600px, we assume it's the mobile size.
			const padding = width < 600 ? 20 : 40; // 20px for mobile, 40px for desktop

			const cellSize = (width - padding) / Math.sqrt(size);
			const newCoordinates = {};

			orderedBoardCells.forEach((cellNumber, index) => {
				// Determine row and column based on the visual zigzag order
				const visualRow = Math.floor(index / Math.sqrt(size));
				const visualCol = index % Math.sqrt(size);
				const halfPadding = padding / 2;
				// Calculate center of the cell
				const x = visualCol * cellSize + cellSize / 2 + halfPadding;
				const y = visualRow * cellSize + cellSize / 2 + halfPadding;

				newCoordinates[cellNumber] = { x, y };
			});
			setCellCoordinates(newCoordinates);
		};

		calculateCoordinates();
		window.addEventListener("resize", calculateCoordinates);
		return () => window.removeEventListener("resize", calculateCoordinates);
	}, [size, orderedBoardCells]);

	return (
		// Main container with background image
		<div
			ref={boardRef} // Corrected className from previous context
			className="w-[300px] md:w-[600px] rounded-lg aspect-square relative bg-cover bg-center"
			style={{ backgroundImage: `url(${boardImage})` }}
		>
			{/* Render player tokens */}
			{Object.entries(playerPositions).map(([player, position]) => {
				const coords = cellCoordinates[position];
				if (!coords) return null;

				// --- Overlap Detection & Offset Logic ---
				// Find if other players are on the same square
				const playersOnSameSquare = Object.keys(playerPositions).filter(
					(p) => playerPositions[p] === position
				);

				let offsetX = 0;
				// If more than one player is on the square, apply an offset
				if (playersOnSameSquare.length > 1) {
					// Simple offset: P1 goes left, P2 goes right.
					// This can be expanded for more players if needed.
					offsetX = player === "P1" ? -10 : 10;
				}

				// Determine token color based on player
				const tokenColor = player === "P1" ? "orangered" : "olive";

				// Dynamically calculate the offset to center the token based on its size
				const tokenCenterOffset = boardWidth < 600 ? 10 : 20; // 10px for w-5, 20px for w-10

				return (
					<div
						key={player}
						className={`absolute w-5 h-5 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white shadow-2xl ring-4 ring-white/80 transition-transform duration-1000 ease-in-out`} // Animation duration
						style={{
							backgroundColor: tokenColor,
							transform: `translate(${
								coords.x - tokenCenterOffset + offsetX
							}px, ${coords.y - tokenCenterOffset}px)`,
							zIndex: 10,
						}}
					>
						{player}
					</div>
				);
			})}

			{/* Optional: Render snakes and ladders for debugging or visual flair */}
			{/* You can add lines or markers for snakes and ladders here if needed */}
		</div>
	);
}
