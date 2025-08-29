import React from 'react';
import { InlineMath } from 'react-katex';

// A simple parser to render text with inline LaTeX
const renderWithLatex = (text) => {
  const parts = text.split(/(\$.*?\$)/g); // Split by inline math delimiter $...$
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
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
