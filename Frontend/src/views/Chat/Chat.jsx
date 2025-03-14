import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Image as ImageIcon } from "lucide-react";
import { useStateContext } from "../../context/ContextProvider";
import Picker from "emoji-picker-react";
import Echo from "laravel-echo";
import { fetchChatMessages, sendMessage, downloadChatLog } from "../../Services/chatService";
import Pusher from "pusher-js";

// Initialize Pusher and Laravel Echo
const echo = new Echo({
  broadcaster: "pusher",
  key: "98772deed0121b2cee33", // Replace with your Pusher key
  cluster: "eu", // Replace with your cluster
  forceTLS: true,
});

export default function Chat() {
  const { user } = useStateContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatMessages(setMessages);
    scrollToBottom();

    // Listen for the message.sent event in the chat channel
    echo.channel("chat").listen("MessageSent", (event) => {
      setMessages((prevMessages) => [...prevMessages, event.message]);
      scrollToBottom(); // Scroll to the bottom when a new message arrives
    });

    return () => {
      echo.channel("chat").stopListening("MessageSent");
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(user, newMessage, selectedEmoji, messages, setMessages, setNewMessage, setSelectedEmoji);
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(newMessage + emoji.emoji); // Append emoji to the message
    setShowEmojiPicker(false); // Hide the emoji picker after selection
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Live Chat</h1>
        <p className="text-sm text-gray-500 mt-1">Chat with your team members in real-time</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${message.sender === user.email ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full" />
            <div className={`flex flex-col space-y-1 max-w-lg ${message.sender === user.email ? "items-end" : ""}`}>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{message.sender}</span>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
              <div className={`rounded-lg px-4 py-2 ${message.sender === user.email ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4 relative">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <button type="button" className="text-gray-400 hover:text-gray-600" title="Attach file">
            <Paperclip className="w-5 h-5" />
          </button>
          <button type="button" className="text-gray-400 hover:text-gray-600" title="Add image">
            <ImageIcon className="w-5 h-5" />
          </button>
          <button type="button" className="text-gray-400 hover:text-gray-600" title="Add emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border-0 focus:ring-0 focus:outline-none"
          />
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors" disabled={!newMessage.trim()}>
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {user.role === "admin" && (
        <div className="bg-white border-t p-4">
          <button onClick={downloadChatLog} className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors">
            Download Chat Log
          </button>
        </div>
      )}
    </div>
  );
}
