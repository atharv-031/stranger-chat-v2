import React, { useState } from 'react';

function Home({ onJoin }) {
  const [nickname, setNickname] = useState('');
  const [isAdult, setIsAdult] = useState(false);

  const handleStart = () => {
    if (!nickname.trim()) return alert('Please enter a nickname');
    if (!isAdult) return alert('You must confirm you are 18+');
    onJoin(nickname.trim());
  };

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: '#1f1f1f',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 0 20px rgba(0,0,0,0.6)',
        textAlign: 'center',
        width: '90%',
        maxWidth: '400px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Stranger Chat</h2>
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: 'none'
          }}
        />
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          color: '#ccc',
          fontSize: '14px'
        }}>
          <input
            type="checkbox"
            checked={isAdult}
            onChange={() => setIsAdult(!isAdult)}
          />
          I confirm I'm 18+ years old
        </div>
        <button
          onClick={handleStart}
          style={{
            width: '100%',
            backgroundColor: '#00ffe1',
            color: '#000',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
}

export default Home;

