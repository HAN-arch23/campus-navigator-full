const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Room name is required'],
        trim: true
    },
    description: {
        type: String,
        default: 'Study room'
    },
    capacity: {
        type: Number,
        default: 10
    },
    location: {
        type: String,
        default: 'Main Building'
    },
    amenities: [{
        type: String
    }],
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
