// src/components/Question.jsx
import React from 'react';
import { renderWithLatex } from '../utils/latexParser.jsx'; //
import { Button, Box, Paper, Typography } from '@mui/material';

function Question({ questionData, onAnswerSelect, selectedAnswer }) {
  if (!questionData) return null; //

  const hasAnswered = selectedAnswer != null; //

  const getButtonColor = (option) => {
    if (!hasAnswered) return 'primary';
    const isCorrectAnswer = option === questionData.options[questionData.answer]; //
    if (isCorrectAnswer) return 'success';
    const isSelectedAnswer = option === selectedAnswer; //
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
      // This new line makes the buttons unclickable after the first answer.
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
        {renderWithLatex(questionData.text)}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {questionData.options.map((option, index) => (
          <Button
            key={index} //
            onClick={() => onAnswerSelect(questionData.id, option)} //
            variant="outlined"
            color={getButtonColor(option)}
            sx={getButtonSx(option)}
          >
            {renderWithLatex(option)}
          </Button>
        ))}
      </Box>
      {hasAnswered && questionData.explanation && (
        <Paper variant="outlined" sx={{ mt: 3, p: 2, textAlign: 'left', bgcolor: 'grey.100' }}>
          <Typography variant="h6">Explanation</Typography>
          <Typography variant="body2">{renderWithLatex(questionData.explanation)}</Typography>
        </Paper>
      )}
    </Paper>
  );
}

export default Question;
