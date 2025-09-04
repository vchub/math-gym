// src/pages/QuizListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes, deleteQuiz } from '../services/quizService';
import { useAuth } from '../hooks/useAuth';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Button, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const allQuizzes = await getQuizzes();
      allQuizzes.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
      setQuizzes(allQuizzes);
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  const handleClickOpen = (quizId) => {
    setSelectedQuizId(quizId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuizId(null);
  };

  const handleDelete = async () => {
    if (selectedQuizId) {
      try {
        await deleteQuiz(selectedQuizId);
        setQuizzes(quizzes.filter(quiz => quiz.id !== selectedQuizId));
        handleClose();
      } catch (error) {
        alert("Failed to delete the quiz. Please try again.");
      }
    }
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (quiz.title && quiz.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div>Loading quizzes...</div>;

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <h1>Available Quizzes</h1>
        <Button variant="contained" component={Link} to="/admin">
          Create Quiz
        </Button>
      </Box>
      <input
        type="text"
        placeholder="Search by title or description..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', width: '300px', padding: "0.6em" }}
      />
      {filteredQuizzes.length > 0 ? (
        <ul style={{ padding: 0 }}>
          {filteredQuizzes.map(quiz => (
            <li key={quiz.id} style={{ listStyle: 'none', border: '1px solid #ccc', margin: '10px', padding: '10px', textAlign: 'left', position: 'relative' }}>
              <h3><MarkdownRenderer content={quiz.title} /></h3>
              <div className="quiz-description">
                <MarkdownRenderer content={quiz.description} />
              </div>
              {quiz.tutorial && (
                <a href={quiz.tutorial} target="_blank" rel="noopener noreferrer" style={{marginRight: '1rem'}}>
                  View Tutorial
                </a>
              )}
              <Link to={`/quiz/${quiz.id}`}>Start Quiz</Link>
              {user && user.uid === quiz.authorId && (
                <IconButton
                  aria-label="delete"
                  onClick={() => handleClickOpen(quiz.id)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No quizzes found.</p>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this quiz? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default QuizListPage;
