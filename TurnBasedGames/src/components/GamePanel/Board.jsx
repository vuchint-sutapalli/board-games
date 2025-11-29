import React from "react";
import Cell from "./Cell";
import { motion } from "framer-motion";

export default function Board({
	cells,
	onCellClick,
	winningLine,
	lastMove,
	animateKey,
}) {
	return (
		<div className="grid grid-cols-3 gap-2">
			{cells.map((c, i) => {
				const isLast = lastMove === i;
				const isInWin = winningLine && winningLine.includes(i);
				return (
					<motion.div
						key={i + "-cell-" + animateKey}
						whileTap={{ scale: 0.95 }}
					>
						<Cell
							index={i}
							value={c}
							onClick={() => onCellClick(i)}
							isWinning={isInWin}
							isLast={isLast}
						/>
					</motion.div>
				);
			})}
		</div>
	);
}
