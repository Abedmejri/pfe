import axiosClient from "../axios-client";

export const fetchMeetings = async () => {
  try {
    const response = await axiosClient.get("/meetings");
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

export const fetchCommissions = async () => {
  try {
    const response = await axiosClient.get("/commissions");
    return response.data;
  } catch (error) {
    console.error("Error fetching commissions:", error);
    throw error;
  }
};

export const createMeeting = async (formData) => {
  try {
    console.log("Creating meeting with form data:", formData); // Log form data here
    const { data } = await axiosClient.post("/meetings", formData);
    return data;
  } catch (error) {
    console.error("Error creating meeting:", error.response?.data || error.message);
    throw error;
  }
};

export const updateMeeting = async (id, meetingData) => {
    try {
      const response = await axiosClient.put(`/meetings/${id}`, meetingData);
      return response.data;
    } catch (error) {
      console.error("Error updating meeting:", error.response ? error.response.data : error.message);
      throw error;
    }
  };
  
  export const deleteMeeting = async (id) => {
    try {
      await axiosClient.delete(`/meetings/${id}`);
    } catch (error) {
      console.error("Error deleting meeting:", error.response ? error.response.data : error.message);
      throw error;
    }
  };
  