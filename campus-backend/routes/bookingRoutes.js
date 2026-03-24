const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('room', 'name location capacity').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// POST /api/bookings - Create a booking
router.post('/', async (req, res) => {
    try {
        const { room, user, date, timeSlot } = req.body;

        if (!room || !user || !date || !timeSlot) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for conflicts
        const existing = await Booking.findOne({ room, date, timeSlot, status: 'confirmed' });
        if (existing) {
            return res.status(409).json({ message: 'This room is already booked for that time slot' });
        }

        const booking = await Booking.create({ room, user, date, timeSlot });
        const populated = await booking.populate('room', 'name location capacity');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// DELETE /api/bookings/:id - Cancel booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
});

module.exports = router;
