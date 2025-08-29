import React from 'react';
import { InlineMath } from 'react-katex';

/**
 * Parses a string and renders any text enclosed in '$...$' or '$$...$$'
 * as a LaTeX math formula.
 * @param {string} text - The text to parse.
 * @returns {Array<React.ReactNode>} - An array of strings and React components.
 */
const renderWithLatex = (text) => {
  // This regex splits the string by either $...$ or $$...$$, keeping the delimiters.
  const parts = text.split(/(\$\$?.+?\$\$?)/g);

  return parts.map((part, index) => {
    // Check for double dollar signs (block math)
    if (part.startsWith('$$') && part.endsWith('$$')) {
      // Use InlineMath to render inside a button; slice off the '$$'
      return <InlineMath key={index} math={part.slice(2, -2).trim()} />;
    }
    // Check for single dollar signs (inline math)
    if (part.startsWith('$') && part.endsWith('$')) {
      // Slice off the '$'
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    // Return regular text parts
    return part;
  });
};

function Question({ questionData, onAnswerSelect, selectedAnswer }) {
  if (!questionData) return null;

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
              backgroundColor: selectedAnswer === option ? '#646cff' : '#1a1a1a'
            }}
          >
            {renderWithLatex(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;