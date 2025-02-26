import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client'; // Use pre-configured axiosClient
import { FileText, Download, Plus, Search } from 'lucide-react';

export default function PV() {
  const [minutes, setMinutes] = useState([]);
  const [commissions, setCommissions] = useState([]); // Added commissions state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    commission: "",
    content: "",
    attendees: ""
  });

  useEffect(() => {
    fetchMinutes();
    fetchCommissions();
  }, []);

  // Fetch meeting minutes from Laravel API
  const fetchMinutes = async () => {
    try {
      const response = await axiosClient.get('/pvs', formData);
      setMinutes(response.data);
    } catch (error) {
      console.error("Error fetching meeting minutes:", error);
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axiosClient.post("/pvs", {
            title: formData.title,
            date: formData.date,
            commission: formData.commission,
            content: formData.content,
            attendees: formData.attendees.split(',').map(a => a.trim()),
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        setMinutes([...minutes, response.data]);
        setShowModal(false);
        setFormData({
            title: "",
            date: "",
            commission: "",
            content: "",
            attendees: ""
        });
    } catch (error) {
        console.error("Error creating minutes:", error.response?.data || error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Meeting Minutes (PV)</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Minutes
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search minutes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {minutes.map((minute) => (
            <div key={minute.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{minute.title}</h3>
                  <p className="text-sm text-gray-500">{minute.commission}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  minute.status === 'Published' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {minute.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Date:</strong> {minute.date}</p>
                  <p><strong>Author:</strong> {minute.author}</p>
                </div>
                <div>
                  <p><strong>Attendees:</strong></p>
                  <p className="text-gray-500">{minute.attendees.join(', ')}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                  <FileText className="w-4 h-4 mr-2" />
                  View
                </button>
                <button className="flex items-center px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Create New Minutes</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Attendees (comma-separated)</label>
                <input
                  type="text"
                  value={formData.attendees}
                  onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
