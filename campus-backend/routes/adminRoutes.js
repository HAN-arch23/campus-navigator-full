const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Middleware to ensure admin access
router.use(protect);
router.use(adminOnly);

// ==========================================
// ANALYTICS ROUTES
// ==========================================

// @route   GET /api/admin/analytics/overview
// @desc    Get dashboard overview stats
router.get('/analytics/overview', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRooms = await Room.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Calculate active bookings (future bookings)
        const activeBookings = await Booking.countDocuments({
            date: { $gte: new Date().toISOString().split('T')[0] },
            status: 'confirmed'
        });

        res.json({
            totalUsers,
            totalRooms,
            totalBookings,
            activeBookings
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
});

// @route   GET /api/admin/analytics/bookings
// @desc    Get booking trends (last 7 days)
router.get('/analytics/bookings', async (req, res) => {
    try {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const stats = await Promise.all(last7Days.map(async (date) => {
            const count = await Booking.countDocuments({ date });
            return { date, count };
        }));

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking trends', error: error.message });
    }
});

// ==========================================
// STUDY SPOT MANAGEMENT
// ==========================================

// @route   GET /api/admin/rooms
// @desc    Get all rooms
router.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error: error.message });
    }
});

// @route   POST /api/admin/rooms
// @desc    Create new room
router.post('/rooms', async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: 'Error creating room', error: error.message });
    }
});

// @route   PUT /api/admin/rooms/:id
// @desc    Update room
router.put('/rooms/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(400).json({ message: 'Error updating room', error: error.message });
    }
});

// @route   DELETE /api/admin/rooms/:id
// @desc    Delete room
router.delete('/rooms/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error: error.message });
    }
});

// ==========================================
// BOOKING MANAGEMENT
// ==========================================

// @route   GET /api/admin/bookings
// @desc    Get all bookings with details
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('room', 'name location')
            .sort({ date: -1, startTime: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// @route   DELETE /api/admin/bookings/:id
// @desc    Cancel booking
router.delete('/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
});

// ==========================================
// USER MANAGEMENT
// ==========================================

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user role', error: error.message });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

module.exports = router;
