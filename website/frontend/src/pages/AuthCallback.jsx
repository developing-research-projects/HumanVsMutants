import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { setAuthToken } from "../services/api";

const AuthCallback = () => {
	const location = useLocation();
	const { login } = useContext(AuthContext);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get("token");
		const refreshToken = params.get("refreshToken");
		if (token && refreshToken) {
			localStorage.setItem("refreshToken", refreshToken);
			setAuthToken(token);
			login(token);
		}
	}, [location, login]);

	return <p>Loading...</p>;
};

export default AuthCallback;
