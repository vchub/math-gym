// src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { auth } from './firebase.js';
import { createUserProfileIfNeeded } from './services/userService';
import { useUserProfile } from './hooks/useUserProfile';

// MUI Imports
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box, Container, useTheme, useMediaQuery, ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';

// Page and Component Imports
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';
import AccountPage from './pages/AccountPage';
import OtherStudentsPage from './pages/OtherStudentsPage.jsx';
import StudentResultsPage from './pages/StudentResultsPage';
import ResultDetailsPage from './pages/ResultDetailsPage';
import 'katex/dist/katex.min.css';


function AppContent() {
  const { user, loading } = useUserProfile();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  useEffect(() => {
    if (user) {
      createUserProfileIfNeeded(user);
      const redirectPath = localStorage.getItem('redirectPath'); // Checks for the saved path
      if (redirectPath) {
        localStorage.removeItem('redirectPath'); // Clears the path
        navigate(redirectPath, { replace: true }); // Navigates to the intended page
      }
    }
  }, [user, navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const getNavLinkClass = ({ isActive }) => isActive ? 'active-link' : '';

  const navItems = [
    { text: 'Quizzes', path: '/' },
    { text: 'Results', path: '/results' },
    { text: 'Create Quiz', path: '/admin' },
    { text: 'Account', path: '/account' },
  ];

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
         <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user && (
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component={NavLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
              Math Gym
            </Typography>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                  {drawerContent}
                </Drawer>
              </>
            ) : (
              <Box>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={NavLink}
                    to={item.path}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&.active': {
                        backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      )}
      <Container component="main" maxWidth="md" sx={{ mt: { xs: 8, sm: 10 }, mb: 4 }}>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
            <Route path="/results/details/:resultId" element={<ProtectedRoute><ResultDetailsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/other-students" element={<ProtectedRoute><OtherStudentsPage /></ProtectedRoute>} />
            <Route path="/students/results/:studentId" element={<ProtectedRoute><StudentResultsPage /></ProtectedRoute>} />
            
            {/* Default Route */}
            <Route path="/" element={<ProtectedRoute><QuizListPage /></ProtectedRoute>} />
        </Routes>
      </Container>
    </>
  );
}

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
