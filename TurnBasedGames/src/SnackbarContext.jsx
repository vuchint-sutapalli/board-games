import React, { createContext, useState, useContext, useCallback } from "react";
import Snackbar from "./components/Snackbar";

const SnackbarContext = createContext(null);

export function useSnackbar() {
	return useContext(SnackbarContext);
}

export function SnackbarProvider({ children }) {
	const [notification, setNotification] = useState(null);

	// Use useCallback to ensure the function reference is stable
	const showSnackbar = useCallback((text, type = "info") => {
		setNotification({ text, type });
	}, []);

	const closeSnackbar = () => {
		setNotification(null);
	};

	return (
		<SnackbarContext.Provider value={{ showSnackbar }}>
			{children}
			<Snackbar
				message={notification?.text}
				type={notification?.type}
				onClose={closeSnackbar}
			/>
		</SnackbarContext.Provider>
	);
}
