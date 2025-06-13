import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import './style.css';

// ✅ Correct cross-domain connection to the backend
const socket = io('https://chat-with-strangers.onrender.com', {
  transports: ['websocket'],
});


function Chat({ nickname }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join", nickname);

    socket.on("message", (data) => {
      setMessages((msgs) => [...msgs, data]);
    });

    socket.on("partner", (name) => {
      setPartner(name);
      setMessages([]);
    });

    return () => socket.disconnect();
  }, [nickname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message);
      setMessage('');
      setShowEmoji(false);
    }
  };

  const skipPartner = () => {
    socket.emit("skip");
    setMessages([]);
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <strong>{nickname} (You)</strong>
          {partner && <span> 🔗 <strong>{partner}</strong></span>}
        </div>
        <button onClick={skipPartner} className="skip-button">Skip</button>
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div className="message" key={i}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-section">
        <button onClick={() => setShowEmoji(!showEmoji)} className="emoji-toggle">😀</button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>

      {showEmoji && (
        <div className="emoji-picker">
          <Picker onEmojiClick={onEmojiClick} theme="dark" />
        </div>
      )}
    </div>
  );
}

export default Chat;
