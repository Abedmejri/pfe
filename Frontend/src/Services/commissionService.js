import axiosClient from "../axios-client";

// Fetch commissions from the backend
export const fetchCommissions = async () => {
  try {
    const { data } = await axiosClient.get("/commissions");
    return data; // Return the data directly
  } catch (error) {
    throw new Error("Error fetching commissions:", error);
  }
};

// Handle form submission for both create and edit
export const saveCommission = async (formData, editingCommission, commissions, setCommissions, setShowModal, setFormData, setEditingCommission) => {
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

    // Reset state
    setShowModal(false);
    setFormData({ name: "", president: "", members: "" });
    setEditingCommission(null);
  } catch (error) {
    throw new Error("Error saving commission:", error);
  }
};

// Handle commission deletion
export const deleteCommission = async (id, commissions, setCommissions) => {
  if (!window.confirm("Are you sure you want to delete this commission?")) return;

  try {
    await axiosClient.delete(`/commissions/${id}`);
    setCommissions(commissions.filter((c) => c.id !== id));
  } catch (error) {
    throw new Error("Error deleting commission:", error);
  }
};
