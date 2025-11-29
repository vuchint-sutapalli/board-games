import React from "react";
import { X, Circle } from "lucide-react";

export default function Cell({ value, onClick, isWinning, isLast, index }) {
	const base =
		"aspect-square rounded-lg flex items-center justify-center text-4xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2";
	return (
		<button
			aria-label={`cell-${index}`}
			className={`${base} ${
				isWinning ? "bg-emerald-500/30 ring-2 ring-emerald-400" : "bg-white/3"
			} ${isLast ? "ring-2 ring-yellow-300" : ""}`}
			onClick={onClick}
		>
			{value === "X" ? (
				<X className="w-10 h-10" />
			) : value === "O" ? (
				<Circle className="w-10 h-10" />
			) : null}
		</button>
	);
}
