import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login"
import Signup from "./components/Signup"
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./components/CreateEvent";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setIsAuthenticated(true);
      setIsGuest(userId === "guest");
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* If logged in, redirect to dashboard */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/create-event" element={isAuthenticated && !isGuest ? <CreateEvent /> : <Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
