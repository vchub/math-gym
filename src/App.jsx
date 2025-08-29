import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage'; // Add this
import 'katex/dist/katex.min.css';

function App() {
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/quiz" />} />
        <Route path="/quiz" element={user ? <QuizPage /> : <Navigate to="/login" />} />
        <Route path="/results" element={user ? <ResultsPage /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Navigate to="/quiz" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
