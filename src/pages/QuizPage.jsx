// src/pages/QuizPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Question from '../components/Question';
import { saveQuizResult } from '../services/quizService';
import { getQuizById } from '../services/quizService';
import { auth } from '../firebase';
import { renderWithLatex } from '../utils/latexParser.jsx';

function QuizPage() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const data = await getQuizById(quizId);
      if (data) {
        setQuizData(data);
      } else {
        console.error("Quiz not found");
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user && quizData) {
      await saveQuizResult(user.uid, quizData, answers);
      alert("Quiz submitted! Check your results.");
      navigate('/results');
    }
  };

  if (loading) return <div>Loading Quiz...</div>;
  if (!quizData) return <div>Failed to load quiz.</div>;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div>
      <h3>{renderWithLatex(quizData.description)}</h3>
      {quizData.tutorial && (
        <p>
          <a href={quizData.tutorial} target="_blank" rel="noopener noreferrer">
            Need help? Check out the tutorial.
          </a>
        </p>
      )}
      <Question
        questionData={currentQuestion}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={answers[currentQuestion.id]}
      />
      {currentQuestionIndex < quizData.questions.length - 1 ? (
        <button onClick={handleNext}>Next</button>
      ) : (
        <button onClick={handleSubmit}>Submit Quiz</button>
      )}
      <button onClick={() => { auth.signOut(); navigate('/login'); }}>Logout</button>
    </div>
  );
}

export default QuizPage;
