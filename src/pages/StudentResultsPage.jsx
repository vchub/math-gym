import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserResults } from '../services/quizService';
import { getUserProfile } from '../services/userService';
import { renderWithLatex } from '../utils/latexParser.jsx';

function StudentResultsPage() {
  const { studentId } = useParams();
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (studentId) {
        const studentProfile = await getUserProfile(studentId);
        setStudent(studentProfile);

        const userResults = await getUserResults(studentId);
        userResults.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
        setResults(userResults);
      }
      setLoading(false);
    };

    fetchStudentData();
  }, [studentId]);

  if (loading) return <div>Loading results...</div>;

  return (
    <div>
      <h1>Quiz Results for {student ? student.displayName : 'Student'}</h1>
      {results.length > 0 ? (
        <ul>
          {results.map(result => (
            <li key={result.id} style={{ listStyle: 'none', border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
               <Link to={`/results/details/${result.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <h3>{renderWithLatex(result.quizTitle)}</h3>
                <p>Score: {result.score} / {result.totalQuestions}</p>
                <p>Date: {result.timestamp ? new Date(result.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</p>
                <p style={{ color: '#646cff', fontWeight: 'bold' }}>View Details &rarr;</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>This student hasn't completed any quizzes yet.</p>
      )}
    </div>
  );
}

export default StudentResultsPage;
