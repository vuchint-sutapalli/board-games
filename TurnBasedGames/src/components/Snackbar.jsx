import React, { useEffect } from "react";

const ICONS = {
	success: "✅",
	error: "❌",
	info: "ℹ️",
};

const COLORS = {
	success: "bg-green-600",
	error: "bg-red-600",
	info: "bg-blue-600",
};

export default function Snackbar({
	message,
	type = "info",
	duration = 4000,
	onClose,
}) {
	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [message, duration, onClose]);

	if (!message) {
		return null;
	}

	const Icon = ICONS[type];
	const bgColor = COLORS[type];

	return (
		<div
			className={`fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-lg text-white font-semibold shadow-2xl animate-fade-in-up ${bgColor}`}
		>
			<span>{Icon}</span>
			<span>{message}</span>
		</div>
	);
}
