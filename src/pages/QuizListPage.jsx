// src/pages/QuizListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes } from '../services/quizService';
import MarkdownRenderer from '../components/MarkdownRenderer';

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const allQuizzes = await getQuizzes();
      allQuizzes.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
      setQuizzes(allQuizzes);
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz =>
    (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (quiz.title && quiz.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div>Loading quizzes...</div>;

  return (
    <div>
      <h1>Available Quizzes</h1>
      <input
        type="text"
        placeholder="Search by title or description..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', width: '300px', padding: "0.6em" }}
      />
      {filteredQuizzes.length > 0 ? (
        <ul style={{ padding: 0 }}>
          {filteredQuizzes.map(quiz => (
            <li key={quiz.id} style={{ listStyle: 'none', border: '1px solid #ccc', margin: '10px', padding: '10px', textAlign: 'left' }}>
              <h3><MarkdownRenderer content={quiz.title} /></h3>
              <p><MarkdownRenderer content={quiz.description} /></p>
              {quiz.tutorial && (
                <a href={quiz.tutorial} target="_blank" rel="noopener noreferrer" style={{marginRight: '1rem'}}>
                  View Tutorial
                </a>
              )}
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
