const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music_mode_db';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('\n📝 To fix this:');
  console.log('   1. Install MongoDB locally, OR');
  console.log('   2. Use MongoDB Atlas (cloud) and update MONGODB_URI in .env file');
  console.log('   3. Make sure MongoDB service is running\n');
});

// Routes
app.use('/api/modes', require('./routes/modes'));
app.use('/api/songs', require('./routes/songs'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


