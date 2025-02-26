import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Image as ImageIcon } from 'lucide-react';
import { useStateContext } from '../context/ContextProvider';
import axiosClient from '../axios-client'; // Assuming axiosClient is set up as per your previous code
import Picker from 'emoji-picker-react'; // Default import for the Picker component

export default function Chat() {
  const { user } = useStateContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for showing emoji picker
  const [selectedEmoji, setSelectedEmoji] = useState(''); // State for storing selected emoji
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat when a new message is added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch chat messages from the backend when the component mounts
    axiosClient.get('/chat')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Error fetching chats:', error);
      });

    scrollToBottom();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
        sender: user.email || 'Current User',
        content: newMessage + selectedEmoji, // Append the selected emoji
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), // Format the timestamp correctly
    };

    try {
        await axiosClient.post('/chat', message);
        setMessages([...messages, message]);
        setNewMessage('');
        setSelectedEmoji(''); // Reset emoji after sending message
    } catch (error) {
        console.error("Error sending message: ", error);
    }
  };

  const handleDownloadLog = () => {
    // Fetch the chat log and download it as a text file
    axiosClient.get('/chat/download', { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat_log.txt';
        a.click();
      })
      .catch(error => {
        console.error('Error downloading chat log:', error);
      });
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji.emoji);
    setShowEmojiPicker(false); // Close the picker after selection
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
            className={`flex items-start space-x-4 ${
              message.sender === user.email ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <img
              src={message.avatar}
              alt={message.sender}
              className="w-10 h-10 rounded-full"
            />
            <div
              className={`flex flex-col space-y-1 max-w-lg ${
                message.sender === user.email ? 'items-end' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {message.sender}
                </span>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.sender === user.email
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            title="Add image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            title="Add emoji"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)} // Toggle emoji picker
          >
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border-0 focus:ring-0 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Admin-only Download Button */}
      {user.role === 'admin' && (
        <div className="bg-white border-t p-4">
          <button
            onClick={handleDownloadLog}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Download Chat Log
          </button>
        </div>
      )}
    </div>
  );
}
