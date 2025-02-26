import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { Calendar, Clock, MapPin, Plus, Users, FileText, Edit, Trash } from "lucide-react";
import { format } from "date-fns";

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [commissions, setCommissions] = useState([]); // New state for commissions
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMeetingId, setEditMeetingId] = useState(null); // Track edit mode
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    commission: "", // Commission will be stored here
    attendees: ""
  });

  useEffect(() => {
    fetchMeetings();
    fetchCommissions(); // Fetch commissions when component loads
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data } = await axiosClient.get("/meetings");
      setMeetings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setLoading(false);
    }
  };

  const fetchCommissions = async () => {
    try {
      const { data } = await axiosClient.get("/commissions"); // Assuming this is the endpoint to fetch commissions
      setCommissions(data);
    } catch (error) {
      console.error("Error fetching commissions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMeetingId) {
        // Update existing meeting
        const { data } = await axiosClient.put(`/meetings/${editMeetingId}`, formData);
        setMeetings(meetings.map((m) => (m.id === editMeetingId ? data : m)));
      } else {
        // Create new meeting
        const { data } = await axiosClient.post("/meetings", formData);
        setMeetings([...meetings, data]);
      }

      setShowModal(false);
      setFormData({ title: "", date: "", time: "", location: "", commission: "", attendees: "" });
      setEditMeetingId(null);
    } catch (error) {
      console.error("Error submitting meeting:", error);
    }
  };

  const handleEdit = (meeting) => {
    setEditMeetingId(meeting.id);
    setFormData(meeting);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await axiosClient.delete(`/meetings/${id}`);
      setMeetings(meetings.filter((meeting) => meeting.id !== id));
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
        <button
          onClick={() => { setShowModal(true); setEditMeetingId(null); setFormData({ title: "", date: "", time: "", location: "", commission: "", attendees: "" }); }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule Meeting
        </button>
      </div>

      {loading ? (
        <p>Loading meetings...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{meeting.title}</h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {meeting.status}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{format(new Date(meeting.date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{meeting.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{meeting.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{meeting.commission}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>{meeting.attendees} attendees</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleEdit(meeting)}>
                  <Edit className="w-4 h-4 inline-block mr-1" /> Edit
                </button>
                <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(meeting.id)}>
                  <Trash className="w-4 h-4 inline-block mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editMeetingId ? "Edit Meeting" : "Schedule New Meeting"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Meeting Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
              <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
              
              {/* Commission Select */}
              <select
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Commission</option>
                {commissions.map((commission) => (
                  <option key={commission.id} value={commission.name}>
                    {commission.name}
                  </option>
                ))}
              </select>

              <input type="number" placeholder="Attendees" value={formData.attendees} onChange={(e) => setFormData({ ...formData, attendees: e.target.value })} required />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => { setShowModal(false); setEditMeetingId(null); }} className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  {editMeetingId ? "Update" : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
