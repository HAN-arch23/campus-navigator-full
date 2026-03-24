require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');

const rooms = [
  { name: 'Music Department Practice Room', description: 'Soundproof room for music students.', location: 'Building A, 2nd Floor', capacity: 15 },
  { name: 'Room 101', description: 'Standard classroom with projector.', location: 'Block B, Room 101', capacity: 30 },
  { name: 'Computer Lab', description: 'Lab with 30 computers and high-speed internet.', location: 'Tech Block, 1st Floor', capacity: 30 },
  { name: 'Engineering Workshop', description: 'Hands-on workshop for engineering students.', location: 'Engineering Block, Ground Floor', capacity: 20 },
  { name: 'Library Study Room', description: 'Quiet room for group study.', location: 'Main Library, 3rd Floor', capacity: 10 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus_navigator');
    await Room.deleteMany({});
    await Room.insertMany(rooms);
    console.log('Rooms seeded');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

seed();
