// src/pages/LoginPage.jsx

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import the hook
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function LoginPage() {
  const [user, loading] = useAuthState(auth); // Use the hook to get user state
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect to home page after login
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Navigation is now handled by the useEffect hook
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  // While checking auth state, show a loading message
  if (loading) {
    return <div>Loading session...</div>;
  }

  // If user is already logged in, the useEffect will redirect.
  // if (user) {
  //   return <div>Redirecting...</div>;
  // }
  
  // Only show the login page if there's no user
  return (
    <div>
      <h1>Welcome to the Math & Physics Gym</h1>
      <p>Please sign in to continue.</p>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
}

export default LoginPage;
