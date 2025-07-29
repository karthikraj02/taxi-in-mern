// src/pages/RiderDashboard.js
import React, { useState, useEffect } from 'react';
import { requestRide, fetchRideStatus } from '../api/rideService';
import { Link } from 'react-router-dom';

export default function RiderDashboard({ user }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [currentRide, setCurrentRide] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Request a new ride
  const handleRequest = async () => {
    if (!pickup.trim() || !dropoff.trim()) {
      setError('Please enter both pickup and dropoff locations.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await requestRide({ rider: user.id, pickup, dropoff });
      setCurrentRide(res.data);
      setPickup('');
      setDropoff('');
      localStorage.setItem('currentRideId', res.data._id);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request ride. Please try again.');
    }
    setLoading(false);
  };

  // Fetch ride status on initial load to persist session state
  useEffect(() => {
    const rideId = localStorage.getItem('currentRideId');
    if (rideId) {
      fetchRideStatus(rideId)
        .then((res) => setCurrentRide(res.data.ride))
        .catch(() => setError('Failed to fetch ride status.'));
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <h2>Welcome, {user.name} (Rider)</h2>
      <button onClick={logout}>Logout</button>

      <h3>Request a Ride</h3>
      <input
        type="text"
        placeholder="Pickup location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input
        type="text"
        placeholder="Dropoff location"
        value={dropoff}
        onChange={(e) => setDropoff(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <button
        onClick={handleRequest}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: loading ? '#ccc' : '#007bff',
          border: 'none',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Requesting...' : 'Request Ride'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {currentRide && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h3>Your Current Ride</h3>
          <p><strong>Status:</strong> {currentRide.status}</p>
          <p><strong>Pickup:</strong> {currentRide.pickup}</p>
          <p><strong>Dropoff:</strong> {currentRide.dropoff}</p>
          <p>
            <strong>Driver:</strong>{' '}
            {currentRide.driver ? currentRide.driver.name || currentRide.driver : 'Not assigned yet'}
          </p>
          <Link to={`/ride/${currentRide._id}`}>View Ride Details</Link>
        </div>
      )}
    </div>
  );
}
