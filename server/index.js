const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(helmet());
app.use(xssClean());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));
app.use(express.static(path.join(__dirname, '../client/public')));

let onlineUsers = 0;
const queue = [];

function tryMatch() {
  while (queue.length >= 2) {
    const socket1 = queue.shift();
    const socket2 = queue.shift();

    if (!socket1.connected || !socket2.connected) continue;

    socket1.partner = socket2;
    socket2.partner = socket1;

    socket1.emit('partner', socket2.nickname);
    socket2.emit('partner', socket1.nickname);

    socket1.emit('message', {
      sender: 'System',
      text: `${socket2.nickname} connected to you`,
    });

    socket2.emit('message', {
      sender: 'System',
      text: `${socket1.nickname} connected to you`,
    });
  }
}

io.on('connection', (socket) => {
  onlineUsers++;
  console.log(`User connected: ${socket.id}, Online: ${onlineUsers}`);
  socket.partner = null;

  socket.on('join', (nickname) => {
    socket.nickname = nickname;
    queue.push(socket);
    tryMatch();
  });

  socket.on('message', (msg) => {
    if (socket.partner) {
      socket.partner.emit('message', { sender: socket.nickname, text: msg });
      socket.emit('message', { sender: 'You', text: msg });
    }
  });

  socket.on('skip', () => {
    if (socket.partner) {
      socket.partner.emit('partner', null);
      socket.partner.emit('message', {
        sender: 'System',
        text: `${socket.nickname} skipped you`,
      });
      socket.partner.partner = null;
    }

    socket.partner = null;
    socket.emit('message', {
      sender: 'System',
      text: 'Re-connecting to another user...',
    });

    queue.push(socket);
    tryMatch();
  });

  socket.on('disconnect', () => {
    onlineUsers--;
    if (socket.partner) {
      socket.partner.emit('partner', null);
      socket.partner.partner = null;
    }

    const i = queue.indexOf(socket);
    if (i !== -1) queue.splice(i, 1);

    console.log(`User disconnected: ${socket.id}, Online: ${onlineUsers}`);
  });
});

app.get('/online-users', (req, res) => {
  res.json({ count: onlineUsers });
});

server.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
