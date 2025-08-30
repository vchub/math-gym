import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { getUserResults } from '../services/quizService';
import { renderWithLatex } from '../utils/latexParser.jsx'; // CHANGED

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const user = auth.currentUser;
      if (user) {
        const userResults = await getUserResults(user.uid);
        userResults.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
        setResults(userResults);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  if (loading) return <div>Loading results...</div>;

  return (
    <div>
      <h1>My Quiz Results</h1>
      {results.length > 0 ? (
        <ul>
          {results.map(result => (
            <li key={result.id} style={{ listStyle: 'none', border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{renderWithLatex(result.quizTitle)}</h3> {/* CHANGED */}
              <p>Score: {result.score} / {result.totalQuestions}</p>
              <p>Date: {result.timestamp ? new Date(result.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't completed any quizzes yet.</p>
      )}
      <Link to="/quiz">Take Another Quiz</Link>
    </div>
  );
}

export default ResultsPage;
