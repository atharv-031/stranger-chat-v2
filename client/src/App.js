import React, { useState } from 'react';
import Home from './Home';
import Chat from './Chat';
import './style.css';

function App() {
  const [nickname, setNickname] = useState(null);
  const [gender, setGender] = useState(null);

  return (
    <>
      {!nickname ? (
        <Home onJoin={setNickname} setGender={setGender} />
      ) : (
        <Chat nickname={nickname} gender={gender} />
      )}
    </>
  );
}

export default App;