import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment"; 

const socket = io("https://event-management-app-bj5y.onrender.com");

function EventList({ events, setEvents }) { 
  const [editingEvent, setEditingEvent] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [updatedTime, setUpdatedTime] = useState("");
  const [updatedLocation, setUpdatedLocation] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // console.log("Logged-in User ID:", userId);

  useEffect(() => {
    const handleNewEvent = (newEvent) => {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    };
  
    const handleUpdatedEvent = (updatedEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    };
  
    const handleDeletedEvent = ({ eventId }) => {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    };
  
    const handleAttendeeJoined = (updatedEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    };
  
   
    socket.on("new_event", handleNewEvent);
    socket.on("event_updated", handleUpdatedEvent);
    socket.on("event_deleted", handleDeletedEvent);
    socket.on("attendee_joined", handleAttendeeJoined);
  
    return () => {
      socket.off("new_event", handleNewEvent);
      socket.off("event_updated", handleUpdatedEvent);
      socket.off("event_deleted", handleDeletedEvent);
      socket.off("attendee_joined", handleAttendeeJoined);
    };
  }, []); 
  
  

  const handleJoinEvent = async (id) => {
    try {
      const res = await axios.post(
        `https://event-management-app-bj5y.onrender.com/events/join/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response.data.message || "Error joining event");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`https://event-management-app-bj5y.onrender.com/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      alert("Error deleting event");
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setUpdatedName(event.name);
    setUpdatedDescription(event.description);
    setUpdatedDate(event.date.split("T")[0]); 
    setUpdatedTime(event.time);
    setUpdatedLocation(event.location);
  };
  

  const handleUpdateEvent = async () => {
    try {
      await axios.put(
        `https://event-management-app-bj5y.onrender.com/events/${editingEvent._id}`,
        {
          name: updatedName,
          description: updatedDescription,
          date: updatedDate, 
          time: updatedTime,
          location: updatedLocation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },  
        }
      );
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event:", error.response?.data || error);
      alert(error.response?.data?.message || "Error updating event");
    }
  };
  

  return (
    <div>
      <h2 className="text-3xl text-white font-semibold text-gray-800 mb-6">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          events.map((event) => {
            const hasJoined = event.attendeeList.includes(userId);
            const isPastEvent = moment(event.date).isBefore(moment()); 
            return (
              <div key={event._id} className="bg-[#E8ECD7] shadow-md rounded-lg p-5">
                <h3 className="text-2xl font-bold text-gray-900">{event.name}</h3>
                <p className="text-gray-700">{event.description}</p>
                <p className="text-sm text-gray-500">
                {moment(event.date).format("MMMM Do YYYY")} | {event.location}
                </p>
                <p className="text-sm text-blue-600">
                  Attendees: {event.attendees}
                </p>

                <button
                onClick={() => handleJoinEvent(event._id)}
                disabled={hasJoined || isPastEvent} 
                className={`mt-3 px-4 py-2 ${
                  isPastEvent ? "bg-gray-400 cursor-not-allowed" :
                  hasJoined ? "bg-gray-400" : "bg-green-600"
                } text-white rounded hover:bg-green-700 transition`}
              >
                {isPastEvent ? "Event Ended" : hasJoined ? "Joined" : "Join Event"}
              </button>

                {event.createdBy &&
                  event.createdBy._id &&
                  userId &&
                  event.createdBy._id.toString() === userId.toString() && (
                    <>
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="mt-3 ml-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="mt-3 ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
              </div>
            );
          })
        )}
      </div>

      {editingEvent && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Edit Event
            </h2>
            <input
              type="text"
              value={updatedName}
              className="w-full p-3 border border-gray-300 rounded mb-3"
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <input
              type="text"
              value={updatedDescription}
              className="w-full p-3 border border-gray-300 rounded mb-3"
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
            <input
              type="date"
              value={updatedDate}
              className="w-full p-3 border border-gray-300 rounded mb-3"
              onChange={(e) => setUpdatedDate(e.target.value)}
            />
            <input
              type="time"
              value={updatedTime}
              className="w-full p-3 border border-gray-300 rounded mb-3"
              onChange={(e) => setUpdatedTime(e.target.value)}
            />
            <input
              type="text"
              value={updatedLocation}
              className="w-full p-3 border border-gray-300 rounded mb-3"
              onChange={(e) => setUpdatedLocation(e.target.value)}
            />
            <button
              className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
              onClick={handleUpdateEvent}
            >
              Update Event
            </button>
            <button
              className="w-full py-3 mt-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition"
              onClick={() => setEditingEvent(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventList;
