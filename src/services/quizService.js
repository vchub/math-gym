import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Saves a user's quiz result, now including the quizId.
 * @param {string} userId - The user's UID.
 * @param {object} quizData - The full quiz object, including its ID.
 * @param {object} answers - The user's answers.
 */
export const saveQuizResult = async (userId, quizData, answers) => {
  let score = 0;
  quizData.questions.forEach(q => {
    if (answers[q.id] === q.options[q.answer]) {
      score++;
    }
  });

  try {
    await addDoc(collection(db, "results"), {
      userId,
      quizId: quizData.id, // Added this field
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

/**
 * Fetches all quiz results for a specific user.
 * @param {string} userId - The user's UID.
 * @returns {Array<object>} - An array of result objects.
 */
export const getUserResults = async (userId) => {
  const results = [];
  const q = query(collection(db, "results"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, ...doc.data() });
  });
  return results;
};

/**
 * Fetches a single result document by its ID.
 * @param {string} resultId - The ID of the result document in Firestore.
 * @returns {object|null} The result object or null if not found.
 */
export const getResultById = async (resultId) => {
  const docRef = doc(db, "results", resultId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such result document!");
    return null;
  }
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
