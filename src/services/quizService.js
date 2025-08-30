import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Add imports

// Function to save a user's quiz result
export const saveQuizResult = async (userId, quizData, answers) => {
  let score = 0;
  quizData.questions.forEach(q => {
    if (answers[q.id] === q.answer) {
      score++;
    }
  });

  try {
    await addDoc(collection(db, "results"), {
      userId,
      quizTitle: quizData.title,
      score,
      totalQuestions: quizData.questions.length,
      answers,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Function to fetch all results for a user
export const getUserResults = async (userId) => {
  const results = [];
  const q = query(collection(db, "results"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, ...doc.data() });
  });
  return results;
};


// Function to get all quizzes
export const getQuizzes = async () => {
  const querySnapshot = await getDocs(collection(db, "quizzes"));
  const quizzes = [];
  querySnapshot.forEach((doc) => {
    quizzes.push({ id: doc.id, ...doc.data() });
  });
  return quizzes;
};

// Function to get a single quiz by its ID
export const getQuizById = async (quizId) => {
  const docRef = doc(db, "quizzes", quizId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such document!");
    return null;
  }
};

// Function to save a new quiz document
export const createQuiz = async (quizData) => {
  try {
    const docRef = await addDoc(collection(db, "quizzes"), {
      ...quizData,
      timestamp: serverTimestamp()
    });
    console.log("Quiz created with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding quiz: ", e);
  }
};
