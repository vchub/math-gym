// src/pages/AdminPage.jsx

import React, { useState } from 'react';
import { createQuiz } from '../services/quizService';
import { createTopic } from '../services/topicService';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';

function AdminPage() {
  const [jsonContent, setJsonContent] = useState('');
  const [uploadType, setUploadType] = useState('quiz');
  const navigate = useNavigate();

  const handleUploadTypeChange = (event) => {
    setUploadType(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedJson = JSON.parse(jsonContent);

      if (uploadType === 'quiz') {
        // Validate the structure of the parsed JSON for a quiz
        if (!parsedJson.title || typeof parsedJson.title !== 'string') {
          throw new Error("Quiz JSON must include a 'title' string.");
        }
        if (!parsedJson.description || typeof parsedJson.description !== 'string') {
          throw new Error("Quiz JSON must include a 'description' string.");
        }
        if (!parsedJson.questions || !Array.isArray(parsedJson.questions)) {
          throw new Error("Quiz JSON must include a 'questions' array.");
        }
        
        const newQuiz = {
          title: parsedJson.title,
          description: parsedJson.description,
          questions: parsedJson.questions,
          authorId: auth.currentUser.uid,
        };

        // Add the tutorial field if it exists in the JSON
        if (parsedJson.externalTutorial && typeof parsedJson.externalTutorial === 'string') {
          newQuiz.externalTutorial = parsedJson.externalTutorial;
        }
        if (parsedJson.internalTutorial && typeof parsedJson.internalTutorial === 'string') {
          newQuiz.internalTutorial = parsedJson.internalTutorial;
        }

        const newQuizId = await createQuiz(newQuiz);
        alert('Quiz created successfully!');
        if (newQuizId) {
          navigate(`/quiz/${newQuizId}`);
        }
      } else { // uploadType === 'topic'
        // Validate the structure of the parsed JSON for a topic
        if (!parsedJson.title || typeof parsedJson.title !== 'string') {
          throw new Error("Topic JSON must include a 'title' string.");
        }
        if (!parsedJson.description || typeof parsedJson.description !== 'string') {
          throw new Error("Topic JSON must include a 'description' string.");
        }
        if (!parsedJson.content || typeof parsedJson.content !== 'string') {
            throw new Error("Topic JSON must include a 'content' string (markdown).");
        }
        if (!parsedJson.quizzes || !Array.isArray(parsedJson.quizzes)) {
          throw new Error("Topic JSON must include a 'quizzes' array.");
        }

        const newTopic = {
            ...parsedJson,
            authorId: auth.currentUser.uid,
        };

        const newTopicId = await createTopic(newTopic);
        alert('Topic created successfully!');
        if (newTopicId) {
            navigate(`/topic/${newTopicId}`);
        }
      }

    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Failed to create content", error);
    }
  };

  return (
    <div>
      <h1>Create New Content</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Content Type</FormLabel>
          <RadioGroup row aria-label="content-type" name="content-type" value={uploadType} onChange={handleUploadTypeChange}>
            <FormControlLabel value="quiz" control={<Radio />} label="Quiz" />
            <FormControlLabel value="topic" control={<Radio />} label="Topic" />
          </RadioGroup>
        </FormControl>
        <textarea
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          placeholder={`Paste complete ${uploadType} JSON here. Full markdown is supported for all text fields (e.g., lists, bold) in addition to LaTeX formulas.`}
          required
          rows="20"
          style={{width: '600px', fontFamily: 'monospace'}}
        />
        <button type="submit">Save {uploadType === 'quiz' ? 'Quiz' : 'Topic'}</button>
      </form>
    </div>
  );
}

export default AdminPage;