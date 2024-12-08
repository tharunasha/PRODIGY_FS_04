const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Assuming you have a Message model

// Route to send a message
router.post('/send', async (req, res) => {
    const { username, room, message } = req.body;

    try {
        const newMessage = new Message({
            username,
            room,
            message,
            createdAt: new Date(),
        });
        
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message sent!', data: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

// Route to get messages from a specific room
router.get('/:room', async (req, res) => {
    const { room } = req.params;

    try {
        const messages = await Message.find({ room }).sort({ createdAt: -1 }).limit(50); // Fetch last 50 messages
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to retrieve messages' });
    }
});

module.exports = router;
