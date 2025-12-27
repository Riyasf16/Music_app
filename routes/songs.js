const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const Mode = require('../models/Mode');

// Get all songs (optionally filtered by modeId)
router.get('/', async (req, res) => {
  try {
    const { modeId } = req.query;
    const query = modeId ? { modeId } : {};
    const songs = await Song.find(query).populate('modeId', 'name').sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('modeId', 'name');
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new song
router.post('/', async (req, res) => {
  try {
    const { name, artist, modeId } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Song name is required' });
    }
    if (!artist || artist.trim() === '') {
      return res.status(400).json({ error: 'Artist name is required' });
    }
    if (!modeId) {
      return res.status(400).json({ error: 'Mode ID is required' });
    }

    // Verify that the mode exists
    const mode = await Mode.findById(modeId);
    if (!mode) {
      return res.status(404).json({ error: 'Mode not found' });
    }

    const song = new Song({
      name: name.trim(),
      artist: artist.trim(),
      modeId
    });
    
    await song.save();
    const populatedSong = await Song.findById(song._id).populate('modeId', 'name');
    res.status(201).json(populatedSong);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update a song
router.put('/:id', async (req, res) => {
  try {
    const { name, artist, modeId } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Song name is required' });
    }
    if (!artist || artist.trim() === '') {
      return res.status(400).json({ error: 'Artist name is required' });
    }

    const updateData = {
      name: name.trim(),
      artist: artist.trim()
    };

    // If modeId is provided, verify it exists
    if (modeId) {
      const mode = await Mode.findById(modeId);
      if (!mode) {
        return res.status(404).json({ error: 'Mode not found' });
      }
      updateData.modeId = modeId;
    }

    const song = await Song.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('modeId', 'name');

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(song);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete a song
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json({ message: 'Song deleted successfully', song });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


