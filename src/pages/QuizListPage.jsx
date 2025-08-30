// src/pages/QuizListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes } from '../services/quizService';

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const allQuizzes = await getQuizzes();
      allQuizzes.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()); // Newest first
      setQuizzes(allQuizzes);
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading quizzes...</div>;

  return (
    <div>
      <h1>Available Quizzes</h1>
      <input
        type="text"
        placeholder="Search by title or description..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', width: '300px' }}
      />
      {filteredQuizzes.length > 0 ? (
        <ul style={{ padding: 0 }}>
          {filteredQuizzes.map(quiz => (
            <li key={quiz.id} style={{ listStyle: 'none', border: '1px solid #ccc', margin: '10px', padding: '10px', textAlign: 'left' }}>
              <h3>{quiz.title}</h3>
              <p>{quiz.shortDescription}</p>
              <Link to={`/quiz/${quiz.id}`}>Start Quiz</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No quizzes found.</p>
      )}
    </div>
  );
}

export default QuizListPage;
