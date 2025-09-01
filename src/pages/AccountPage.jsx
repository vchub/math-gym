import React, { useState } from 'react';
import { auth } from '../firebase';
import { addUserToFollow } from '../services/userService';

function AccountPage() {
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
    <div>
      <h1>My Account</h1>
      <h2>Add User to View Your Results</h2>
      <p>Enter another user's email address to allow them to view your quiz results.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="User's email"
          required
          style={{ width: '300px' }}
        />
        <button type="submit">Add User</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AccountPage;
