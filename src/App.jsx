// src/App.jsx

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom'; // Changed Link to NavLink
import { auth } from './firebase.js';
import { createUserProfileIfNeeded } from './services/userService';
import { useUserProfile } from './hooks/useUserProfile';

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
import LampSwitchGamePage from './pages/LampSwitchGamePage';
import 'katex/dist/katex.min.css';

// This wrapper component allows us to use router hooks
function AppContent() {
  const { user, loading } = useUserProfile();
  const navigate = useNavigate();

  // This effect will run when the user state changes
  useEffect(() => {
    if (user) {
      createUserProfileIfNeeded(user);
      const redirectPath = localStorage.getItem('redirectPath');
      if (redirectPath) {
        localStorage.removeItem('redirectPath');
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

  const getNavLinkClass = ({ isActive }) => isActive ? 'active-link' : '';

  return (
    <>
      {user && (
        <header className="app-header">
          <nav>
            <div className="nav-links">
              <NavLink to="/" className={getNavLinkClass} end>Quizzes</NavLink>
              <NavLink to="/lamp-switch" className={getNavLinkClass}>Lamp Switch</NavLink>
              <NavLink to="/results" className={getNavLinkClass}>Results</NavLink>
              <NavLink to="/admin" className={getNavLinkClass}>Create Quiz</NavLink>
              <NavLink to="/account" className={getNavLinkClass}>Account</NavLink>
            </div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </nav>
        </header>
      )}
      <main className="app-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/lamp-switch" element={<ProtectedRoute><LampSwitchGamePage /></ProtectedRoute>} />
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
