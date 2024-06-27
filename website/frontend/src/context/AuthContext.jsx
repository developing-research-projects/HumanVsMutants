import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const { exp } = jwtDecode(token); // Use jwtDecode to decode the token
			if (Date.now() >= exp * 1000) {
				// Token has expired
				logout();
			} else {
				axios
					.get(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
						headers: { Authorization: `Bearer ${token}` },
					})
					.then((response) => {
						setUser(response.data);
						setLoading(false);
					})
					.catch((error) => {
						setLoading(false);
					});
			}
		} else {
			setLoading(false);
		}
	}, []);

	const login = (token) => {
		localStorage.setItem("token", token);
		axios
			.get(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				setUser(response.data);
				navigate("/dashboard");
			})
			.catch((error) => {
			});
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
		setUser(null);
		navigate("/");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
