// /frontend/src/pages/DriverDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DriverDashboard({ user }) {
  const [pendingRides, setPendingRides] = useState([]);
  const [currentRides, setCurrentRides] = useState([]);
  const [error, setError] = useState('');
  const [loadingAccept, setLoadingAccept] = useState(null); // rideId that is loading accept

  const API_BASE_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Fetch list of rides with status "requested"
  const fetchPendingRides = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/rides/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRides(res.data.rides);
    } catch (err) {
      setError('Failed to load pending rides');
    }
  };

  // Fetch list of rides accepted by this driver
  const fetchCurrentRides = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/rides/driver/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentRides(res.data.rides);
    } catch (err) {
      setError('Failed to load current rides');
    }
  };

  useEffect(() => {
    fetchPendingRides();
    fetchCurrentRides();
  }, []);

  // Accept a ride
  const acceptRide = async (rideId) => {
    setLoadingAccept(rideId);
    try {
      await axios.post(
        `${API_BASE_URL}/rides/accept/${rideId}`,
        { driver: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh lists after accepting
      await fetchPendingRides();
      await fetchCurrentRides();
    } catch (err) {
      setError('Failed to accept ride');
    }
    setLoadingAccept(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Welcome, {user.name} (Driver)</h2>
      <button onClick={logout}>Logout</button>

      <h3>Pending Ride Requests</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pendingRides.length === 0 ? (
        <p>No pending rides at the moment.</p>
      ) : (
        <ul>
          {pendingRides.map((ride) => (
            <li key={ride._id} style={{ marginBottom: '10px' }}>
              <p>
                <strong>Pickup:</strong> {ride.pickup} | <strong>Dropoff:</strong> {ride.dropoff}
              </p>
              <button
                onClick={() => acceptRide(ride._id)}
                disabled={loadingAccept === ride._id}
              >
                {loadingAccept === ride._id ? 'Accepting...' : 'Accept Ride'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Your Current Rides</h3>
      {currentRides.length === 0 ? (
        <p>You have no accepted rides currently.</p>
      ) : (
        <ul>
          {currentRides.map((ride) => (
            <li key={ride._id} style={{ marginBottom: '10px' }}>
              <p>
                <strong>Status:</strong> {ride.status}
              </p>
              <p>
                <strong>Pickup:</strong> {ride.pickup} | <strong>Dropoff:</strong> {ride.dropoff}
              </p>
              <p>
                <strong>Rider:</strong> {ride.rider?.name || ride.rider}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
