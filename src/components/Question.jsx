import React from 'react';
import { renderWithLatex } from '../utils/latexParser.jsx'; // CHANGED

function Question({ questionData, onAnswerSelect, selectedAnswer }) {
  if (!questionData) return null;

  const hasAnswered = selectedAnswer != null;

  const getButtonStyle = (option) => {
    if (!hasAnswered) {
      return { backgroundColor: '#1a1a1a' };
    }
    const isCorrectAnswer = option === questionData.answer;
    const isSelectedAnswer = option === selectedAnswer;
    if (isCorrectAnswer) {
      return { backgroundColor: '#28a745' };
    }
    if (isSelectedAnswer && !isCorrectAnswer) {
      return { backgroundColor: '#dc3545' };
    }
    return { backgroundColor: '#1a1a1a', opacity: 0.6 };
  };

  return (
    <div className="card">
      <h3>{renderWithLatex(questionData.text)}</h3>
      <div>
        {questionData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(questionData.id, option)}
            style={{
              margin: '5px',
              ...getButtonStyle(option)
            }}
            disabled={hasAnswered}
          >
            {renderWithLatex(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
