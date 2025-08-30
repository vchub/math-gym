// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import './App.css';
import LoginPage from './pages/LoginPage';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';
import 'katex/dist/katex.min.css';

function App() {
  const [user, loading] = useAuthState(auth);

  const handleLogout = () => {
    auth.signOut();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
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
          <Route path="/quiz/:quizId" element={user ? <QuizPage /> : <Navigate to="/login" />} />
          <Route path="/results" element={user ? <ResultsPage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user ? <AdminPage /> : <Navigate to="/login" />} />
          
          {/* Default Route */}
          <Route path="/" element={user ? <QuizListPage /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
