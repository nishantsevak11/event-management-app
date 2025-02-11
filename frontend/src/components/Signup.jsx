import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/dashboard";
    }
  }, [navigate]);

  //  Handle Signup and Auto-Login
  const handleSignup = async () => {
    try {
      const res = await axios.post("https://event-management-app-bj5y.onrender.com/auth/signup", { name, email, password });

  
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Signup</h2>
        <input type="text" placeholder="Name" className="w-full p-3 border rounded mb-3" onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full p-3 border rounded mb-3" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-3 border rounded mb-3" onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition" onClick={handleSignup}>
          Signup
        </button>
      </div>
    </div>
  );
}

export default Signup;
