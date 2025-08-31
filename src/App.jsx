// src/App.jsx

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';
import 'katex/dist/katex.min.css';

// This wrapper component allows us to use router hooks
function AppContent() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // This effect will run when the user state changes
  useEffect(() => {
    if (user) {
      const redirectPath = localStorage.getItem('redirectPath');
      if (redirectPath) {
        localStorage.removeItem('redirectPath');
        console.log('redirectPath',redirectPath)
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, navigate]);


  const handleLogout = () => {
    auth.signOut();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user && (
        <header className="app-header">
          <nav>
            <div className="nav-links">
              <Link to="/">Quizzes</Link>
              <Link to="/results">My Results</Link>
              <Link to="/admin">Create Quiz</Link>
            </div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </nav>
        </header>
      )}
      <main className="app-content">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          
          {/* Protected Routes */}
          <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          
          {/* Default Route */}
          <Route path="/" element={<ProtectedRoute><QuizListPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
