// src/components/Question.jsx
import React, { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Button, Box, Paper, Typography, Collapse } from '@mui/material';

// Fisher-Yates (aka Knuth) shuffle algorithm
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array]; // Create a copy

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

function Question({ questionData, onAnswerSelect, selectedAnswer }) {
  const [showHint, setShowHint] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    if (questionData && questionData.options) {
      setShuffledOptions(shuffleArray(questionData.options));
    }
    setShowHint(false);
  }, [questionData]);

  if (!questionData) return null;

  const hasAnswered = selectedAnswer != null;

  const getButtonColor = (option) => {
    if (!hasAnswered) return 'primary';
    const isCorrectAnswer = option === questionData.options[questionData.answer];
    if (isCorrectAnswer) return 'success';
    const isSelectedAnswer = option === selectedAnswer;
    if (isSelectedAnswer) return 'error';
    return 'primary';
  };

  const getButtonSx = (option) => {
    const isSelected = option === selectedAnswer;
    const isCorrect = option === questionData.options[questionData.answer];
    
    const styles = {
      justifyContent: 'flex-start',
      textTransform: 'none',
      borderWidth: '1px'
    };

    if (hasAnswered) {
      styles.pointerEvents = 'none';
      if (isSelected || isCorrect) {
        styles.borderWidth = '2px';
      } else {
        styles.opacity = 0.6;
      }
    }
    
    return styles;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, my: 2 }}>
      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        <MarkdownRenderer content={questionData.text} />
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {shuffledOptions.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswerSelect(questionData.id, option)}
            variant="outlined"
            color={getButtonColor(option)}
            sx={getButtonSx(option)}
          >
            <MarkdownRenderer content={option} />
          </Button>
        ))}
      </Box>
      
      {questionData.hint && (
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </Button>
          <Collapse in={showHint}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Typography variant="body2" component="div"><MarkdownRenderer content={questionData.hint} /></Typography>
            </Paper>
          </Collapse>
        </Box>
      )}

      {hasAnswered && questionData.explanation && (
        <Paper variant="outlined" sx={{ mt: 3, p: 2, textAlign: 'left', bgcolor: 'grey.100' }}>
          <Typography variant="h6">Explanation</Typography>
          <Typography variant="body2" component="div"><MarkdownRenderer content={questionData.explanation} /></Typography>
        </Paper>
      )}
    </Paper>
  );
}

export default Question;
