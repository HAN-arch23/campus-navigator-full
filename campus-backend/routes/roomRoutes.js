const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// GET /api/rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true });
        if (rooms.length === 0) {
            const defaultRooms = [
                { name: 'Library Study Room A', description: 'Quiet individual study room', capacity: 4, location: 'Library, Floor 2', amenities: ['Whiteboard', 'Power outlets'] },
                { name: 'Library Study Room B', description: 'Group collaboration space', capacity: 8, location: 'Library, Floor 2', amenities: ['Projector', 'Whiteboard', 'Power outlets'] },
                { name: 'Innovation Lab', description: 'Tech-equipped creative space', capacity: 12, location: 'Engineering Block', amenities: ['Smart TV', 'Computers', 'Power outlets'] },
                { name: 'Seminar Room 1', description: 'Formal seminar and presentation room', capacity: 20, location: 'Main Building', amenities: ['Projector', 'Microphone', 'Air conditioning'] },
                { name: 'Rooftop Study Lounge', description: 'Open-air relaxed study area', capacity: 15, location: 'Rooftop, Main Building', amenities: ['WiFi', 'Lounge seating'] },
                { name: 'Science Lab Room', description: 'Equipped for science project work', capacity: 6, location: 'Science Block', amenities: ['Lab equipment', 'Power outlets'] },
            ];
            await Room.insertMany(defaultRooms);
            const seeded = await Room.find({ isAvailable: true });
            return res.json(seeded);
        }
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error: error.message });
    }
});

// GET /api/rooms/:id
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching room', error: error.message });
    }
});

// POST /api/rooms
router.post('/', async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: 'Error creating room', error: error.message });
    }
});

// PUT /api/rooms/:id
router.put('/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(400).json({ message: 'Error updating room', error: error.message });
    }
});

// DELETE /api/rooms/:id
router.delete('/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json({ message: 'Room deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error: error.message });
    }
});

module.exports = router;
