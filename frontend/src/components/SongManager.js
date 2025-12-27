import React, { useState } from 'react';
import './SongManager.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SongManager = ({ mode, songs, onSongCreated, onSongUpdated, onSongDeleted, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [formData, setFormData] = useState({ name: '', artist: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const resetForm = () => {
    setFormData({ name: '', artist: '' });
    setEditingSong(null);
    setShowForm(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const url = editingSong 
        ? `${API_BASE_URL}/songs/${editingSong._id}`
        : `${API_BASE_URL}/songs`;
      
      const method = editingSong ? 'PUT' : 'POST';

      const payload = editingSong
        ? { ...formData, modeId: mode._id }
        : { ...formData, modeId: mode._id };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save song');
      }

      resetForm();
      if (editingSong) {
        onSongUpdated();
      } else {
        onSongCreated();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setFormData({
      name: song.name,
      artist: song.artist,
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (songId) => {
    if (!window.confirm('Are you sure you want to delete this song?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete song');
      }

      onSongDeleted();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="song-manager">
      <div className="section-header">
        <h2>Songs - {mode.name}</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          disabled={loading}
        >
          + Add Song
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingSong ? 'Edit Song' : 'Add New Song'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="song-name">Song Name *</label>
              <input
                type="text"
                id="song-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Bohemian Rhapsody"
              />
            </div>
            <div className="form-group">
              <label htmlFor="artist">Artist *</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                required
                placeholder="e.g., Queen"
              />
            </div>
            {error && <div className="error-text">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : (editingSong ? 'Update' : 'Add')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="songs-list">
        {loading && songs.length === 0 ? (
          <div className="loading">Loading songs...</div>
        ) : songs.length === 0 ? (
          <div className="empty-state">No songs in this mode yet. Add your first song!</div>
        ) : (
          songs.map(song => (
            <div key={song._id} className="song-card">
              <div className="song-card-content">
                <h3>{song.name}</h3>
                <p className="song-artist">by {song.artist}</p>
              </div>
              <div className="song-card-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(song)}
                  title="Edit song"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleDelete(song._id)}
                  title="Delete song"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SongManager;


