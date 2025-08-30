import React from 'react';
import { InlineMath } from 'react-katex';

/**
 * Parses a string and renders any text enclosed in '$...$' or '$$...$$'
 * as a LaTeX math formula.
 * @param {string} text - The text to parse.
 * @returns {Array<React.ReactNode>} - An array of strings and React components.
 */
const renderWithLatex = (text) => {
  const parts = text.split(/(\$\$?.+?\$\$?)/g);

  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return <InlineMath key={index} math={part.slice(2, -2).trim()} />;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return part;
  });
};

function Question({ questionData, onAnswerSelect, selectedAnswer }) {
  if (!questionData) return null;

  const hasAnswered = selectedAnswer != null;

  const getButtonStyle = (option) => {
    if (!hasAnswered) {
      return { backgroundColor: '#1a1a1a' }; // Default style
    }

    const isCorrectAnswer = option === questionData.answer;
    const isSelectedAnswer = option === selectedAnswer;

    if (isCorrectAnswer) {
      return { backgroundColor: '#28a745' }; // Green for correct
    }
    if (isSelectedAnswer && !isCorrectAnswer) {
      return { backgroundColor: '#dc3545' }; // Red for incorrect selection
    }
    
    // Style for other non-selected, incorrect options
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
            disabled={hasAnswered} // Disable buttons after an answer is selected
          >
            {renderWithLatex(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;