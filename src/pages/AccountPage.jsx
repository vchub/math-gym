import React, { useState } from 'react';
import { auth } from '../firebase';
import { addTeacherForStudent } from '../services/userService';

function AccountPage() {
  const [teacherEmail, setTeacherEmail] = useState('');
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

    try {
      await addTeacherForStudent(auth.currentUser.uid, teacherEmail);
      setMessage(`Successfully added ${teacherEmail} as your teacher.`);
      setTeacherEmail('');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h1>My Account</h1>
      <h2>Add a Teacher</h2>
      <p>Enter your teacher's email address to allow them to view your quiz results.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <input
          type="email"
          value={teacherEmail}
          onChange={(e) => setTeacherEmail(e.target.value)}
          placeholder="Teacher's email"
          required
          style={{ width: '300px' }}
        />
        <button type="submit">Add Teacher</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AccountPage;
