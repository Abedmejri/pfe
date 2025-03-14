import axiosClient from "../axios-client";

export const fetchChatMessages = async (setMessages) => {
  try {
    const response = await axiosClient.get("/chat");
    setMessages(response.data);
  } catch (error) {
    console.error("Error fetching chats:", error);
  }
};


export const sendMessage = async (user, newMessage, selectedEmoji, messages, setMessages, setNewMessage, setSelectedEmoji) => {
    if (!newMessage.trim()) return;
  
    const message = {
      sender: user.email || "Current User",
      content: newMessage + selectedEmoji,
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
  
    try {
      await axiosClient.post("/chat", message);  // Call the store method instead of sendMessage
      setMessages([...messages, message]);
      setNewMessage("");
      setSelectedEmoji(""); // Reset emoji after sending message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
export const downloadChatLog = () => {
  axiosClient
    .get("/chat/download", { responseType: "blob" })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "chat_log.txt";
      a.click();
    })
    .catch((error) => {
      console.error("Error downloading chat log:", error);
    });
};