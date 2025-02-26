import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import axiosClient from "../axios-client";

export default function Commissions() {
  const [commissions, setCommissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    president: "",
    members: "",
  });
  const [editingCommission, setEditingCommission] = useState(null);

  // Fetch commissions from the backend
  useEffect(() => {
    axiosClient.get("/commissions")
      .then(({ data }) => setCommissions(data))
      .catch((error) => console.error("Error fetching commissions:", error));
  }, []);

  // Handle form submission for both create and edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCommission) {
        // Edit existing commission
        const { id } = editingCommission;
        const { data } = await axiosClient.put(`/commissions/${id}`, formData);
        setCommissions(commissions.map((c) => (c.id === id ? data : c)));
      } else {
        // Create new commission
        const { data } = await axiosClient.post("/commissions", formData);
        setCommissions([...commissions, data]);
      }

      setShowModal(false);
      setFormData({ name: "", president: "", members: "" });
      setEditingCommission(null);
    } catch (error) {
      console.error("Error saving commission:", error);
    }
  };

  // Handle commission deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this commission?")) return;
    
    try {
      await axiosClient.delete(`/commissions/${id}`);
      setCommissions(commissions.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting commission:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Commissions</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingCommission(null);
            setFormData({ name: "", president: "", members: "" });
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Commission
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">President</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commissions.map((commission) => (
              <tr key={commission.id}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  {commission.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.members} members</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.president}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => {
                      setEditingCommission(commission);
                      setFormData({
                        name: commission.name,
                        president: commission.president,
                        members: commission.members,
                      });
                      setShowModal(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(commission.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCommission ? "Edit Commission" : "New Commission"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Commission Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">President</label>
                <input
                  type="text"
                  value={formData.president}
                  onChange={(e) => setFormData({ ...formData, president: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Members</label>
                <input
                  type="number"
                  value={formData.members}
                  onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                  {editingCommission ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
