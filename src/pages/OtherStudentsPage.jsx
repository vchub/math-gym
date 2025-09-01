import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { getUserProfile } from '../services/userService';

function OtherStudentsPage() {
  const { profile, loading: profileLoading } = useUserProfile();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (profile && profile.followers && profile.followers.length > 0) {
        const studentPromises = profile.followers.map(uid => getUserProfile(uid));
        const studentProfiles = await Promise.all(studentPromises);
        setStudents(studentProfiles.filter(p => p != null));
      }
      setLoading(false);
    };

    if (!profileLoading) {
      fetchFollowers();
    }
  }, [profile, profileLoading]);

  if (profileLoading || loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>Other Students</h1>
      <h2>Students Who Added You</h2>
      <p>The following users have granted you permission to view their quiz results.</p>
      {students.length > 0 ? (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {students.map(student => (
            <li key={student.uid} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', textAlign: 'left' }}>
              <p><strong>Name:</strong> {student.displayName}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <Link to={`/results/${student.uid}`}>View Results</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No students have added you yet.</p>
      )}
    </div>
  );
}

export default OtherStudentsPage;
