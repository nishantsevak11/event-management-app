import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateEvent() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(""); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId === "guest") {
      alert("Guests cannot create events.");
      navigate("/dashboard");
    }
  }, [userId, navigate]);

  const handleCreateEvent = async () => {
    try {
      await axios.post(
        "https://event-management-app-bj5y.onrender.com/events/create",
        { name, description, date, time, location, category }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Event created successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to create event.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create Event</h2>
        <input type="text" placeholder="Event Name" className="w-full p-3 border rounded mb-3" onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Description" className="w-full p-3 border rounded mb-3" onChange={(e) => setDescription(e.target.value)} />
        <input type="date" className="w-full p-3 border rounded mb-3" onChange={(e) => setDate(e.target.value)} />
        <input type="time" className="w-full p-3 border rounded mb-3" onChange={(e) => setTime(e.target.value)} />
        <input type="text" placeholder="Location" className="w-full p-3 border rounded mb-3" onChange={(e) => setLocation(e.target.value)} />
        
       
        <select className="w-full p-3 border rounded mb-3" onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="tech">Tech</option>
          <option value="music">Music</option>
          <option value="sports">Sports</option>
          <option value="education">Education</option>
        </select>

        <button className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition" onClick={handleCreateEvent}>
          Create Event
        </button>
      </div>
    </div>
  );
}

export default CreateEvent;
