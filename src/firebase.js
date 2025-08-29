// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Optional

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZp1u9z6z9FdIIr6jfS2y4MLL31zTMu3I",
  authDomain: "math-gym-e1325.firebaseapp.com",
  projectId: "math-gym-e1325",
  storageBucket: "math-gym-e1325.firebasestorage.app",
  messagingSenderId: "814757267933",
  appId: "1:814757267933:web:ece2217ac16a1124d14e34",
  measurementId: "G-F2LXQLLR7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app); // Optional
