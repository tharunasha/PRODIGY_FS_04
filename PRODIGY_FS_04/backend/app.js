require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

// Enable CORS
app.use(cors({
  origin: "http://127.0.0.1:5500"
}));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Connect to the database
connectDB().then(() => {
  // Middleware
  app.use(express.json());
  app.use('/api/auth', authRoutes);

  // Serve login, register, and chat pages
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
  });

  app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/register.html'));
  });

  app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/chat.html'));
  });

  // Socket.io events
  io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // Join a room and announce to other users
    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        socket.broadcast.to(room).emit('message', { username: 'System', text: `${username} has joined the room.` });
    });

    // Handle chat messages
    socket.on('chatMessage', ({ username, text, room }) => {
        io.to(room).emit('message', { username, text });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


  // Start server only if DB connection is successful
  server.listen(3000, () => console.log('Server running on port 3000'));
}).catch(error => {
  console.error("Failed to connect to the database:", error.message);
});

