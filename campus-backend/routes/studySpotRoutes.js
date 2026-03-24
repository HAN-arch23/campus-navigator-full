const express = require('express');
const router = express.Router();
const StudySpot = require('../models/StudySpot');

router.get('/', async (req, res) => {
  try {
    const spots = await StudySpot.find();
    res.json(spots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const spot = new StudySpot(req.body);
    await spot.save();
    res.status(201).json(spot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
