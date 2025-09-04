import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getResultById, getQuizById } from '../services/quizService';
import MarkdownRenderer from '../components/MarkdownRenderer';

function ResultDetailsPage() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const resultData = await getResultById(resultId);
      if (resultData && resultData.quizId) {
        setResult(resultData);
        const quizData = await getQuizById(resultData.quizId);
        setQuiz(quizData);
      } else {
        console.error("Result or quizId not found");
      }
      setLoading(false);
    };

    if (resultId) {
      fetchDetails();
    }
  }, [resultId]);

  if (loading) return <div>Loading Details...</div>;
  if (!result || !quiz) return <div>Could not load result details.</div>;
  
  return (
    <div>
      <h1>Details for: <MarkdownRenderer content={quiz.title} /></h1>
      <p><strong>Score:</strong> {result.score} / {result.totalQuestions}</p>
      <p><strong>Date:</strong> {result.timestamp ? new Date(result.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</p>

      <div style={{ textAlign: 'left', marginTop: '2rem' }}>
        {quiz.questions.map((question, index) => {
          const userAnswer = result.answers[question.id];
          const correctAnswer = question.options[question.answer];
          const isCorrect = userAnswer === correctAnswer;
          
          return (
            <div key={question.id} style={{ border: '1px solid #444', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <h4><MarkdownRenderer content={question.text} /></h4>
              <p>Your Answer: <span style={{ color: isCorrect ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>{userAnswer ? <MarkdownRenderer content={userAnswer} /> : 'Not Answered'}</span></p>
              {!isCorrect && (
                <p>Correct Answer: <span style={{ color: '#28a745' }}><MarkdownRenderer content={correctAnswer} /></span></p>
              )}
              {question.explanation && (
                 <div style={{ fontStyle: 'italic', color: '#aaa', marginTop: '10px' }}>Explanation: <MarkdownRenderer content={question.explanation} /></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultDetailsPage;
