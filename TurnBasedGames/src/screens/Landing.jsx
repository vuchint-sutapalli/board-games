import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Placeholder images - create an `assets` folder in `src` and add your images.
import tictactoeImage from "../assets/tictactoe.jpeg";
import chessImage from "../assets/chess.jpeg";
import snakeLadderImage from "../assets/snakesandladders.png";

const gameImages = {
	tictactoe: tictactoeImage,
	chess: chessImage,
	"snake-ladder": snakeLadderImage,
};

const AVAILABLE_GAMES = [
	{
		id: "chess",
		name: "Chess",
		modes: [{ id: "human", name: "Play vs Human" }],
	},
	{
		id: "tictactoe",
		name: "Tic Tac Toe",
		modes: [
			{ id: "human", name: "Play vs Human" },
			{ id: "bot", name: "Play vs Computer" },
		],
	},
	{
		id: "snake-ladder",
		name: "Snake and Ladder",
		modes: [{ id: "human", name: "Play vs Human" }],
	},
];

function Landing() {
	const navigate = useNavigate();
	// State to hold the selected game object and mode ID
	const [selectedGame, setSelectedGame] = useState(AVAILABLE_GAMES[0]); // Default to the first game

	const handleGameSelect = (game) => {
		setSelectedGame(game);
	};

	const handleJoin = (modeId) => {
		if (selectedGame) {
			navigate(`/play/${selectedGame.id}?opponent=${modeId}`);
			// navigate(`/local/${selectedGame.id}`);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen w-screen bg-slate-900 font-sans p-4">
			<div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex overflow-hidden">
				{/* Left Column: Dynamic Hero Image */}
				<div className="w-1/2 hidden md:block">
					<img
						src={gameImages[selectedGame.id]}
						alt={`${selectedGame.name} game`}
						className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
					/>
				</div>

				{/* Right Column: Game & Mode Selection */}
				<div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
						Turn-Based Games
					</h1>
					<p className="text-gray-500 mb-10">
						Select a game and opponent to begin.
					</p>

					{/* Game Selection */}
					<div className="mb-10">
						<h2 className="text-xl font-semibold text-gray-700 mb-4">
							1. Choose Game
						</h2>
						<div className="flex flex-col sm:flex-row gap-4">
							{AVAILABLE_GAMES.map((game) => (
								<button
									key={game.id}
									onClick={() => handleGameSelect(game)}
									className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
										selectedGame.id === game.id
											? "border-sky-500 bg-sky-50 text-sky-600 shadow-lg"
											: "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 hover:shadow-sm"
									}`}
								>
									<span className="font-semibold">{game.name}</span>
								</button>
							))}
						</div>
					</div>

					{/* Mode Selection */}
					<div>
						<h2 className="text-xl font-semibold text-gray-700 mb-4">
							2. Select Mode
						</h2>
						<div className="flex gap-2">
							{selectedGame.modes.map((mode) => (
								<button
									key={mode.id}
									onClick={() => handleJoin(mode.id)}
									className="w-full mb-3 py-3 px-6 text-lg rounded-lg bg-green-500 text-white font-bold transition-transform transform hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-md"
								>
									{mode.name}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Landing;
