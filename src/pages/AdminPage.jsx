import React, { useState } from 'react';
import { createQuiz } from '../services/quizService';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [jsonContent, setJsonContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedJson = JSON.parse(jsonContent);

      // Validate the structure of the parsed JSON
      if (!parsedJson.title || typeof parsedJson.title !== 'string') {
        throw new Error("JSON must include a 'title' string.");
      }
      if (!parsedJson.description || typeof parsedJson.description !== 'string') {
        throw new Error("JSON must include a 'description' string.");
      }
      if (!parsedJson.questions || !Array.isArray(parsedJson.questions)) {
        throw new Error("JSON must include a 'questions' array.");
      }
      
      const newQuiz = {
        title: parsedJson.title,
        description: parsedJson.description,
        questions: parsedJson.questions,
        authorId: auth.currentUser.uid,
      };

      const newQuizId = await createQuiz(newQuiz);
      alert('Quiz created successfully!');
      if (newQuizId) {
        navigate(`/quiz/${newQuizId}`);
      }

    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Failed to create quiz", error);
    }
  };

  return (
    <div>
      <h1>Create a New Quiz</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <textarea
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          placeholder='Paste complete quiz JSON here, including title, description, and questions.'
          required
          rows="20"
          style={{width: '600px', fontFamily: 'monospace'}}
        />
        <button type="submit">Save Quiz</button>
      </form>
    </div>
  );
}

export default AdminPage;
