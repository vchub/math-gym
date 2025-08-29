import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

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
