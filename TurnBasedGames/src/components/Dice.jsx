import React, { useState, useEffect } from "react";

const Dot = () => <span className="w-4 h-4 bg-black rounded-full"></span>;

const DiceFace = ({ children, isRolling }) => (
	<div
		className={`w-20 h-20 bg-white rounded-lg shadow-lg p-4 transition-transform duration-100 ${
			isRolling ? "animate-shake" : ""
		}`}
	>
		{children}
	</div>
);

const Dice = ({ roll, loading }) => {
	const [displayRoll, setDisplayRoll] = useState(roll);

	useEffect(() => {
		if (loading) {
			// When loading, start a fast interval to simulate rolling
			const interval = setInterval(() => {
				setDisplayRoll(Math.floor(Math.random() * 6) + 1);
			}, 75);

			// Stop the animation after a short period, even if no result comes back
			const timeout = setTimeout(() => clearInterval(interval), 2000);

			return () => {
				clearInterval(interval);
				clearTimeout(timeout);
			};
		} else {
			// When not loading, show the final roll value
			setDisplayRoll(roll);
		}
	}, [loading, roll]);

	// The switch statement now uses the internal displayRoll state
	switch (displayRoll) {
		case 1:
			return (
				<DiceFace isRolling={loading}>
					<div className="flex justify-center items-center h-full">
						<Dot />
					</div>
				</DiceFace>
			);
		case 2:
			return (
				<DiceFace isRolling={loading}>
					<div className="flex flex-col justify-between h-full">
						<div className="flex justify-end">
							<Dot />
						</div>
						<div className="flex justify-start">
							<Dot />
						</div>
					</div>
				</DiceFace>
			);
		case 3:
			return (
				<DiceFace isRolling={loading}>
					<div className="flex flex-col justify-between h-full">
						<div className="flex justify-end">
							<Dot />
						</div>
						<div className="flex justify-center">
							<Dot />
						</div>
						<div className="flex justify-start">
							<Dot />
						</div>
					</div>
				</DiceFace>
			);
		case 4:
			return (
				<DiceFace isRolling={loading}>
					<div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
						<Dot />
						<Dot />
						<Dot />
						<Dot />
					</div>
				</DiceFace>
			);
		case 5:
			return (
				<DiceFace isRolling={loading}>
					<div className="grid grid-cols-3 grid-rows-3 h-full">
						<Dot className="col-start-1 row-start-1" />
						<Dot className="col-start-3 row-start-1" />
						<Dot className="col-start-2 row-start-2" />
						<Dot className="col-start-1 row-start-3" />
						<Dot className="col-start-3 row-start-3" />
					</div>
				</DiceFace>
			);
		case 6:
			return (
				<DiceFace isRolling={loading}>
					<div className="grid grid-cols-2 grid-rows-3 gap-y-2 h-full">
						<Dot />
						<Dot />
						<Dot />
						<Dot />
						<Dot />
						<Dot />
					</div>
				</DiceFace>
			);
		default:
			return null; // Don't show anything if there's no roll
	}
};

export default Dice;
