// src/pages/AdminPage.jsx

import React, { useState } from 'react';
import { createQuiz } from '../services/quizService';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      const parsedJson = JSON.parse(jsonContent);
      if (!parsedJson.questions || !Array.isArray(parsedJson.questions)) {
        throw new Error("JSON must have a 'questions' array.");
      }
      
      const newQuiz = {
        title,
        shortDescription: description,
        questions: parsedJson.questions,
        authorId: auth.currentUser.uid,
      };

      const newQuizId = await createQuiz(newQuiz);
      alert('Quiz created successfully!');
      navigate(`/quiz/${newQuizId}`);

    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Failed to create quiz", error);
    }
  };

  return (
    <div>
      <h1>Create a New Quiz</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz Title" required style={{width: '300px'}}/>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short Description" required style={{width: '300px'}}/>
        <textarea
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          placeholder='Paste quiz JSON here (e.g., {"questions": [...]})'
          required
          rows="15"
          style={{width: '500px'}}
        />
        <button type="submit">Save Quiz</button>
      </form>
    </div>
  );
}

export default AdminPage;
