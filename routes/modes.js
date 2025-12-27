const express = require('express');
const router = express.Router();
const Mode = require('../models/Mode');

// Get all modes
router.get('/', async (req, res) => {
  try {
    const modes = await Mode.find().sort({ createdAt: -1 });
    res.json(modes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single mode by ID
router.get('/:id', async (req, res) => {
  try {
    const mode = await Mode.findById(req.params.id);
    if (!mode) {
      return res.status(404).json({ error: 'Mode not found' });
    }
    res.json(mode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new mode
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Mode name is required' });
    }

    const mode = new Mode({ name: name.trim(), description: description?.trim() || '' });
    await mode.save();
    res.status(201).json(mode);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update a mode
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Mode name is required' });
    }

    const mode = await Mode.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), description: description?.trim() || '' },
      { new: true, runValidators: true }
    );

    if (!mode) {
      return res.status(404).json({ error: 'Mode not found' });
    }

    res.json(mode);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete a mode
router.delete('/:id', async (req, res) => {
  try {
    const mode = await Mode.findByIdAndDelete(req.params.id);
    if (!mode) {
      return res.status(404).json({ error: 'Mode not found' });
    }
    res.json({ message: 'Mode deleted successfully', mode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


