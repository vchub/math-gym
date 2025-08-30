import React from 'react';
import { InlineMath } from 'react-katex';

/**
 * Parses a string and renders any text enclosed in '$...$' or '$$...$$'
 * as a LaTeX math formula.
 * @param {string} text - The text to parse.
 * @returns {Array<React.ReactNode>} - An array of strings and React components.
 */
export const renderWithLatex = (text) => {
  // Return early if text is not a string to avoid errors
  if (typeof text !== 'string') {
    return text;
  }
  
  // This regex splits the string by either $...$ or $$...$$, keeping the delimiters.
  const parts = text.split(/(\$\$?.+?\$\$?)/g);

  return parts.map((part, index) => {
    // Check for double dollar signs (block math)
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return <InlineMath key={index} math={part.slice(2, -2).trim()} />;
    }
    // Check for single dollar signs (inline math)
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    // Return regular text parts
    return part;
  });
};
