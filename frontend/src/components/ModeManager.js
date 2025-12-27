import React, { useState } from 'react';
import './ModeManager.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ModeManager = ({ modes, selectedMode, onModeSelect, onModeCreated, onModeUpdated, onModeDeleted, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMode, setEditingMode] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingMode(null);
    setShowForm(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const url = editingMode 
        ? `${API_BASE_URL}/modes/${editingMode._id}`
        : `${API_BASE_URL}/modes`;
      
      const method = editingMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save mode');
      }

      resetForm();
      if (editingMode) {
        onModeUpdated();
      } else {
        onModeCreated();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (mode) => {
    setEditingMode(mode);
    setFormData({
      name: mode.name,
      description: mode.description || '',
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (modeId) => {
    if (!window.confirm('Are you sure you want to delete this mode? All songs in this mode will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/modes/${modeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete mode');
      }

      onModeDeleted();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="mode-manager">
      <div className="section-header">
        <h2>Music Modes</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          disabled={loading}
        >
          + New Mode
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingMode ? 'Edit Mode' : 'Create New Mode'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Mode Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Workout, Chill, Focus"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Optional description for this mode"
              />
            </div>
            {error && <div className="error-text">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : (editingMode ? 'Update' : 'Create')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="modes-list">
        {loading && modes.length === 0 ? (
          <div className="loading">Loading modes...</div>
        ) : modes.length === 0 ? (
          <div className="empty-state">No modes created yet. Create your first mode!</div>
        ) : (
          modes.map(mode => (
            <div
              key={mode._id}
              className={`mode-card ${selectedMode?._id === mode._id ? 'selected' : ''}`}
              onClick={() => onModeSelect(mode)}
            >
              <div className="mode-card-content">
                <h3>{mode.name}</h3>
                {mode.description && <p className="mode-description">{mode.description}</p>}
              </div>
              <div className="mode-card-actions">
                <button
                  className="btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(mode);
                  }}
                  title="Edit mode"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(mode._id);
                  }}
                  title="Delete mode"
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

export default ModeManager;


