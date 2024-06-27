import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
	const { user, loading } = useContext(AuthContext);

	if (loading) {
		return <p>Loading...</p>;
	}

	return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
