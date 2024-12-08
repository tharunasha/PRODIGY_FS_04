document.addEventListener("DOMContentLoaded", () => {
  const socket = io('http://localhost:3000'); // Ensure this is your server URL and port

  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message');
  const messagesList = document.getElementById('messages');

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const msg = messageInput.value;
    
    if (msg.trim()) {
      // Emit the message to the server
      socket.emit('chatMessage', { room: 'Room1', text: msg });
      messageInput.value = ''; // Clear the input
    } else {
      alert("Message cannot be empty!");
    }
  });

  // Listen for 'message' events from the server and display the messages in the chat
  socket.on('message', (msg) => {
    console.log("Message received from server:", msg); // Log incoming message
    const messageElement = document.createElement('li');
    messageElement.textContent = msg.text; 
    messagesList.appendChild(messageElement);
});

  socket.on('connect_error', (error) => {
    console.error("Connection error:", error);
    alert("Could not connect to the server. Please try again later.");
  });
});
