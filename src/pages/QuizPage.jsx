// src/pages/QuizPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Question from '../components/Question';
import { saveQuizResult, getQuizById } from '../services/quizService';
import { auth } from '../firebase';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Box, Button, Typography, Paper, Link as MuiLink, Collapse } from '@mui/material';

function QuizPage() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showQuizHint, setShowQuizHint] = useState(false);
  const [showInternalTutorial, setShowInternalTutorial] = useState(false);
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

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
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
    <Box>
      <Typography variant="h5" align="center">
        Question {currentQuestionIndex + 1} of {quizData.questions.length}
      </Typography>
      
      <Question
        questionData={currentQuestion}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={answers[currentQuestion.id]}
      />

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        {currentQuestionIndex < quizData.questions.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>Next</Button>
        ) : (
          <Button variant="contained" color="success" onClick={handleSubmit}>Submit Quiz</Button>
        )}
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        {/* <Typography variant="h6" gutterBottom>
          Idea: {renderWithLatex(quizData.title)}
        </Typography>
        <Typography variant="body1">
          {renderWithLatex(quizData.description)}
        </Typography> */}
        
        {quizData.internalTutorial && (
          <Box sx={{ mt: 2 }}>
            <Button onClick={() => setShowInternalTutorial(!showInternalTutorial)}>
              {showInternalTutorial ? 'Hide Tutorial' : 'Show Tutorial'}
            </Button>
            <Collapse in={showInternalTutorial}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="body2"><MarkdownRenderer content={quizData.internalTutorial} /></Typography>
              </Paper>
            </Collapse>
          </Box>
        )}

        {quizData.externalTutorial && (
          <Typography sx={{ mt: 1 }}>
            <MuiLink href={quizData.externalTutorial} target="_blank" rel="noopener noreferrer">
              Need more help? Check out the external tutorial.
            </MuiLink>
          </Typography>
        )}


        {quizData.hint && (
          <Box sx={{ mt: 2 }}>
            <Button onClick={() => setShowQuizHint(!showQuizHint)}>
              {showQuizHint ? 'Hide Quiz Hint' : 'Show Quiz Hint'}
            </Button>
            <Collapse in={showQuizHint}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="body2"><MarkdownRenderer content={quizData.hint} /></Typography>
              </Paper>
            </Collapse>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default QuizPage;
