import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">Event Management App</h1>
        <p className="text-lg text-gray-700 mb-6">Organize and join amazing events with ease!</p>
        <div className="space-x-4">
          <Link to="/login">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Login</button>
          </Link>
          <Link to="/signup">
            <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
