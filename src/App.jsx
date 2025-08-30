// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import LoginPage from './pages/LoginPage';
import QuizListPage from './pages/QuizListPage'; // New
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage'; // New
import 'katex/dist/katex.min.css';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {/* Optional: Simple navigation for logged-in users */}
      {user && (
        <nav>
          <Link to="/">Quizzes</Link> | <Link to="/results">My Results</Link> | <Link to="/admin">Create Quiz</Link>
        </nav>
      )}
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route path="/quiz/:quizId" element={user ? <QuizPage /> : <Navigate to="/login" />} />
        <Route path="/results" element={user ? <ResultsPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user ? <AdminPage /> : <Navigate to="/login" />} />
        
        {/* Default Route */}
        <Route path="/" element={user ? <QuizListPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
