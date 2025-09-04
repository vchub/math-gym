// src/pages/TopicListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTopics } from '../services/topicService';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Box, Button } from '@mui/material';

function TopicListPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      const allTopics = await getTopics();
      allTopics.sort((a, b) => a.title.localeCompare(b.title));
      setTopics(allTopics);
      setLoading(false);
    };
    fetchTopics();
  }, []);

  if (loading) return <div>Loading topics...</div>;

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <h1>Topics</h1>
        <Button variant="contained" component={Link} to="/admin">
          Create Content
        </Button>
      </Box>
      {topics.length > 0 ? (
        <ul style={{ padding: 0 }}>
          {topics.map(topic => (
            <li key={topic.id} style={{ listStyle: 'none', border: '1px solid #ccc', margin: '10px', padding: '10px', textAlign: 'left' }}>
              <Link to={`/topic/${topic.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3><MarkdownRenderer content={topic.title} /></h3>
                <div><MarkdownRenderer content={topic.description} /></div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No topics found.</p>
      )}
    </div>
  );
}

export default TopicListPage;
