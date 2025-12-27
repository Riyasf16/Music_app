const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Song name is required'],
    trim: true,
    maxlength: [200, 'Song name cannot exceed 200 characters']
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
    maxlength: [200, 'Artist name cannot exceed 200 characters']
  },
  modeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mode',
    required: [true, 'Mode ID is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Song', songSchema);


