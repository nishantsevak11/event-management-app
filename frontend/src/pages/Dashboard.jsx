import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import EventList from "../components/EventList";

function Dashboard() {
  const [category, setCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterType, setFilterType] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [userName, setUserName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isGuest = userId === "guest";

 
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true }); 
    } else {
      axios.get(`https://event-management-app-bj5y.onrender.com/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name))
      .catch(() => setUserName("Guest"));
    }
  }, [navigate, token, userId]);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = { category, filterType };
        if (filterType === "upcoming" && dateFilter) {
          params.dateFilter = dateFilter;
        }
        const res = await axios.get("https://event-management-app-bj5y.onrender.com/events", { params });
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [category, dateFilter, filterType]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setTimeout(() => {
      window.location.href = "/"
    }, 100); 
  };

  return (
    <div className="min-h-screen bg-[#2D336B] text-white">
      <div className="max-w-4xl mx-auto py-10 px-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold">Event Dashboard</h1>

          {/* 🔹 Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="px-4 py-2 bg-[#7886C7] text-white rounded-lg hover:bg-[#A9B5DF] transition"
            >
              Profile
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <p className="px-4 py-2 text-gray-700">{userName}</p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Create Event Button (Only for Logged-in Users) */}
        {!isGuest && (
          <div className="mb-6">
            <Link to="/create-event">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                + Create New Event
              </button>
            </Link>
          </div>
        )}

        {/* 🔹 Filters */}
        <div className="mb-6 flex space-x-4">
          <select 
            className="p-2 border rounded bg-[#2D336B]" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="tech">Tech</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
          </select>

          {/* 🔹 Date Filter (Fixed) */}
          <select 
            className="p-2 border rounded bg-[#2D336B]" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            disabled={filterType === "past"} 
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <button
            onClick={() => setFilterType("upcoming")}
            className={`p-2 border rounded ${filterType === "upcoming" ? "bg-gray-500 text-white" : ""}`}
          >
            Upcoming Events
          </button>

          <button
            onClick={() => setFilterType("past")}
            className={`p-2 border rounded ${filterType === "past" ? "bg-gray-600 text-white" : ""}`}
          >
            Past Events
          </button>
        </div>

        {/* 🔹 Pass Filtered Events to EventList */}
        <EventList events={events} setEvents={setEvents} />
      </div>
    </div>
  );
}

export default Dashboard;
