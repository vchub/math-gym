// src/pages/LoginPage.jsx

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

function LoginPage() {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Navigation is now handled by the main App component
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Math & Physics Gym</h1>
      <p>Please sign in to continue.</p>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
}

export default LoginPage;
