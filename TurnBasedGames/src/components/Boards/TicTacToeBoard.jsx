import React from "react";

// This mapping translates server state ('P1', 'P2') to UI marks ('X', 'O')
const PLAYER_TO_MARK_MAP = {
	P1: "X",
	P2: "O",
};

export default function TicTacToeBoard({ board, onCellClick }) {
	return (
		<div className="grid grid-cols-3 gap-2 min-w-xs md:min-w-md max-w-xl aspect-square bg-slate-700 p-2 rounded-lg">
			{board.map((player, index) => {
				const mark = PLAYER_TO_MARK_MAP[player]; // 'X', 'O', or undefined
				return (
					<button
						data-testid={`cell-${index}`}
						key={index}
						onClick={() => onCellClick(index)}
						className="bg-slate-800 rounded-lg flex items-center justify-center text-lg md:text-4xl font-bold text-white hover:bg-slate-600 disabled:hover:bg-slate-800"
						disabled={!!player} // Button is disabled if the cell is occupied by any player
					>
						{mark === "X" && <span className="text-sky-400">{mark}</span>}
						{mark === "O" && <span className="text-amber-400">{mark}</span>}
						{!mark && <span>&nbsp;</span>}
					</button>
				);
			})}
		</div>
	);
}
