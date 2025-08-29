import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/quiz'); // Redirect to quiz after successful login
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
