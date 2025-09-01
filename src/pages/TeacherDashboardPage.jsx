import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { getUserProfile } from '../services/userService';

function TeacherDashboardPage() {
  const { profile, loading: profileLoading } = useUserProfile();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (profile && profile.myStudents && profile.myStudents.length > 0) {
        const studentPromises = profile.myStudents.map(uid => getUserProfile(uid));
        const studentProfiles = await Promise.all(studentPromises);
        setStudents(studentProfiles.filter(p => p != null));
      }
      setLoading(false);
    };

    if (!profileLoading) {
      fetchStudents();
    }
  }, [profile, profileLoading]);

  if (profileLoading || loading) {
    return <div>Loading dashboard...</div>;
  }
  
  if (profile?.role !== 'teacher') {
    return <div>You do not have permission to view this page.</div>
  }

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <h2>My Students</h2>
      {students.length > 0 ? (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {students.map(student => (
            <li key={student.uid} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', textAlign: 'left' }}>
              <p><strong>Name:</strong> {student.displayName}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <Link to={`/teacher/results/${student.uid}`}>View Results</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No students have added you as their teacher yet.</p>
      )}
    </div>
  );
}

export default TeacherDashboardPage;
