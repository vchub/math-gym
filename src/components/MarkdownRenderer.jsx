// src/components/MarkdownRenderer.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// KaTeX CSS is already imported globally in App.jsx

const MarkdownRenderer = ({ content }) => {
  if (typeof content !== 'string') {
    return null;
  }

  // Replace the literal '\\n' with the newline character '\n'
  const correctedContent = content.replace(/\\n/g, '\n');

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {correctedContent}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
