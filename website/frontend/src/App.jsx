import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import AuthProvider from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/auth/callback" element={<AuthCallback />} />
					<Route
						path="/dashboard"
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route
						path="/task"
						element={
							<PrivateRoute>
								<Task />
							</PrivateRoute>
						}
					/>
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
