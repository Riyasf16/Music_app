const mongoose = require('mongoose');

const modeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mode name is required'],
    trim: true,
    maxlength: [100, 'Mode name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mode', modeSchema);


