// src/pages/TopicPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopicById } from '../services/topicService';
import { getQuizById } from '../services/quizService';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Box, Paper, Typography, List, ListItemButton, ListItemText, Divider, ListItemIcon } from '@mui/material';

function TopicPage() {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopicData = async () => {
      setLoading(true);
      const topicData = await getTopicById(topicId);
      setTopic(topicData);

      if (topicData && topicData.quizIds) {
        const quizPromises = topicData.quizIds.map(id => getQuizById(id));
        const quizResults = await Promise.all(quizPromises);
        setQuizzes(quizResults.filter(q => q)); // Filter out any nulls if a quiz isn't found
      }
      
      setLoading(false);
    };

    fetchTopicData();
  }, [topicId]);

  if (loading) return <div>Loading topic...</div>;
  if (!topic) return <div>Topic not found.</div>;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <MarkdownRenderer content={topic.title} />
        </Typography>
        <Box sx={{textAlign: 'left'}}>
            <MarkdownRenderer content={topic.content} />
        </Box>
      </Paper>

      {quizzes.length > 0 && (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Homework
          </Typography>
          <List>
            {quizzes.map((quiz, index) => (
              <React.Fragment key={quiz.id}>
                <ListItemButton component={Link} to={`/quiz/${quiz.id}`}>
                  <ListItemIcon>
                    <Typography>{index + 1}.</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={<MarkdownRenderer content={quiz.title} />}
                    secondary={<MarkdownRenderer content={quiz.description} />}
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItemButton>
                {index < quizzes.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default TopicPage;
