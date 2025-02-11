import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000); 
    }
  }, [navigate]); 

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      
      
      setTimeout(() => {
        
        window.location.href = "/dashboard";
      }, 1000); 
    } catch (error) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

 
  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/guest-login");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", "guest");

      setTimeout(() => {
        
        window.location.href = "/dashboard";
      }, 1000); 
    } catch (error) {
      alert("Guest login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading} 
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading} 
        />
        <button
          className={`w-full py-3 ${loading ? "bg-gray-400" : "bg-blue-600"} text-white font-bold rounded ${loading ? "" : "hover:bg-blue-700 transition"}`}
          onClick={handleLogin}
          disabled={loading} 
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          className={`w-full py-3 mt-3 ${loading ? "bg-gray-400" : "bg-gray-600"} text-white font-bold rounded ${loading ? "" : "hover:bg-gray-700 transition"}`}
          onClick={handleGuestLogin}
          disabled={loading}
        >
          {loading ? "Logging in as Guest..." : "Continue as Guest"}
        </button>
      </div>
    </div>
  );
}

export default Login;
