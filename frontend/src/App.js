import React, { useState, useEffect } from 'react';
import './App.css';
import ModeManager from './components/ModeManager';
import SongManager from './components/SongManager';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all modes
  const fetchModes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/modes`);
      if (!response.ok) throw new Error('Failed to fetch modes');
      const data = await response.json();
      setModes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch songs for selected mode
  const fetchSongs = async (modeId) => {
    if (!modeId) {
      setSongs([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/songs?modeId=${modeId}`);
      if (!response.ok) throw new Error('Failed to fetch songs');
      const data = await response.json();
      setSongs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModes();
  }, []);

  useEffect(() => {
    if (selectedMode) {
      fetchSongs(selectedMode._id);
    } else {
      setSongs([]);
    }
  }, [selectedMode]);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleModeCreated = () => {
    fetchModes();
  };

  const handleModeUpdated = () => {
    fetchModes();
    if (selectedMode) {
      const updatedMode = modes.find(m => m._id === selectedMode._id);
      if (updatedMode) {
        setSelectedMode(updatedMode);
      }
    }
  };

  const handleModeDeleted = () => {
    fetchModes();
    if (selectedMode) {
      const modeExists = modes.find(m => m._id === selectedMode._id);
      if (!modeExists) {
        setSelectedMode(null);
        setSongs([]);
      }
    }
  };

  const handleSongCreated = () => {
    if (selectedMode) {
      fetchSongs(selectedMode._id);
    }
  };

  const handleSongUpdated = () => {
    if (selectedMode) {
      fetchSongs(selectedMode._id);
    }
  };

  const handleSongDeleted = () => {
    if (selectedMode) {
      fetchSongs(selectedMode._id);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎵 Music Mode Recommendation System</h1>
      </header>
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <div className="container">
        <div className="main-content">
          <ModeManager
            modes={modes}
            selectedMode={selectedMode}
            onModeSelect={handleModeSelect}
            onModeCreated={handleModeCreated}
            onModeUpdated={handleModeUpdated}
            onModeDeleted={handleModeDeleted}
            loading={loading}
          />
          
          {selectedMode && (
            <SongManager
              mode={selectedMode}
              songs={songs}
              onSongCreated={handleSongCreated}
              onSongUpdated={handleSongUpdated}
              onSongDeleted={handleSongDeleted}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


