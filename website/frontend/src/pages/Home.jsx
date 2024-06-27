import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();
	const { user, loading } = useContext(AuthContext);

	const handleLogin = () => {
		window.location.href = `${import.meta.env.VITE_APP_API_URL}/auth/github`;
	};

	useEffect(() => {
		if (!loading && user) {
			navigate("/dashboard");
		}
	}, [loading, user, navigate]);

	return (
		<div>
			<Navbar />
			<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
				{loading ? (
					<p>Loading...</p>
				) : (
					<div className="flex flex-col items-center justify-center">
						<p className="w-5/6 mb-3 text-4xl font-medium text-center text-gray-900 lg:text-5xl lg:w-full">
							Tasks Management
						</p>
						<p className="w-5/6 text-lg font-light text-center text-gray-900 lg:text-2xl lg:w-full">
							Use your Github account to sign up for this app
						</p>
						<Button
							className="w-5/6 mt-6 text-lg font-normal lg:text-xl"
							onClick={handleLogin}
						>
							Sign up with GitHub <FaGithub className="mx-2 w-7 h-7" />
						</Button>
						<p className="w-5/6 mt-6 text-xl font-light text-center text-gray-600 lg:w-full">
							Summer Research Program in Software Engineering
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
