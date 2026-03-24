const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    user: {
        type: String,
        required: [true, 'User name is required']
    },
    date: {
        type: String,
        required: [true, 'Date is required']
    },
    timeSlot: {
        type: String,
        required: [true, 'Time slot is required']
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
