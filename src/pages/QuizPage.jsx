// src/pages/QuizPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Question from '../components/Question';
import { saveQuizResult, getQuizById } from '../services/quizService'; //
import { auth } from '../firebase'; //
import { renderWithLatex } from '../utils/latexParser.jsx'; //
import { Box, Button, Typography, Paper, Link as MuiLink } from '@mui/material';

function QuizPage() {
  const { quizId } = useParams(); //
  const [quizData, setQuizData] = useState(null); //
  const [loading, setLoading] = useState(true); //
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); //
  const [answers, setAnswers] = useState({}); //
  const navigate = useNavigate(); //

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true); //
      const data = await getQuizById(quizId); //
      if (data) {
        setQuizData(data); //
      } else {
        console.error("Quiz not found"); //
      }
      setLoading(false); //
    };
    fetchQuiz(); //
  }, [quizId]); //

  // This function was missing from the previous example
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer })); //
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1); //
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser; //
    if (user && quizData) {
      await saveQuizResult(user.uid, quizData, answers); //
      alert("Quiz submitted! Check your results."); //
      navigate('/results'); //
    }
  };

  if (loading) return <div>Loading Quiz...</div>; //
  if (!quizData) return <div>Failed to load quiz.</div>; //

  const currentQuestion = quizData.questions[currentQuestionIndex]; //

  return (
    <Box>
      <Typography variant="h5" align="center">
        Question {currentQuestionIndex + 1} of {quizData.questions.length}
      </Typography>
      
      <Question
        questionData={currentQuestion}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={answers[currentQuestion.id]}
      />

      <Paper variant="outlined" sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          About this quiz: {renderWithLatex(quizData.title)}
        </Typography>
        <Typography variant="body1">
          {renderWithLatex(quizData.description)}
        </Typography>
        {quizData.tutorial && (
          <Typography sx={{ mt: 1 }}>
            <MuiLink href={quizData.tutorial} target="_blank" rel="noopener noreferrer">
              Need help? Check out the tutorial.
            </MuiLink>
          </Typography>
        )}
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        {currentQuestionIndex < quizData.questions.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>Next</Button>
        ) : (
          <Button variant="contained" color="success" onClick={handleSubmit}>Submit Quiz</Button>
        )}
      </Box>
    </Box>
  );
}

export default QuizPage;
