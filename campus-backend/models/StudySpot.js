const mongoose = require('mongoose');

const StudySpotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  coords: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('StudySpot', StudySpotSchema);
