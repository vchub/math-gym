import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { addUserToFollow } from '../services/userService';
import { Button } from '@mui/material';

function AccountPage() {
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!auth.currentUser) {
      setError("You must be logged in.");
      return;
    }

    if (auth.currentUser.email === userEmail) {
      setError("You cannot add yourself.");
      return;
    }

    try {
      await addUserToFollow(auth.currentUser.uid, userEmail);
      setMessage(`Successfully allowed ${userEmail} to view your results.`);
      setUserEmail('');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <h1>Account</h1>
      
      <div style={{ border: '1px solid #444', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' }}>
        <h2>Permissions</h2>
        <p>Manage which users can see your results or view results shared with you.</p>
      </div>

      <div style={{ border: '1px solid #444', borderRadius: '8px', padding: '1rem' }}>
        <h2>Grant Viewing Access</h2>
        <p>Enter another user's email address to allow them to view your quiz results.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="User's email"
            required
            style={{ width: '300px', padding: '0.6em' }}
          />
          <button type="submit">Add User</button>
        </form>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 3 }}>
        Logout
      </Button>
    </div>
  );
}

export default AccountPage;
