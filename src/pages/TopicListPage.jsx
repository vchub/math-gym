import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTopics, deleteTopic } from '../services/topicService';
import { useAuth } from '../hooks/useAuth';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Box, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TopicListPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTopics = async () => {
      const allTopics = await getTopics();
      allTopics.sort((a, b) => a.title.localeCompare(b.title));
      setTopics(allTopics);
      setLoading(false);
    };
    fetchTopics();
  }, []);

  const handleClickOpen = (topicId) => {
    setSelectedTopicId(topicId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTopicId(null);
  };

  const handleDelete = async () => {
    if (selectedTopicId) {
      try {
        await deleteTopic(selectedTopicId);
        setTopics(topics.filter(topic => topic.id !== selectedTopicId));
        handleClose();
      } catch (error) {
        alert("Failed to delete the topic. Please try again.");
      }
    }
  };

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
            <li key={topic.id} style={{ listStyle: 'none', border: '1px solid #ccc', margin: '10px', padding: '10px', textAlign: 'left', position: 'relative' }}>
              <Link to={`/topic/${topic.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3><MarkdownRenderer content={topic.title} /></h3>
                <div><MarkdownRenderer content={topic.description} /></div>
              </Link>
              {user && user.uid === topic.authorId && (
                <IconButton
                  aria-label="delete"
                  onClick={() => handleClickOpen(topic.id)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No topics found.</p>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this topic? This will also delete all associated quizzes. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TopicListPage;
