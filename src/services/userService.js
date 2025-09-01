import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, arrayUnion } from "firebase/firestore";

/**
 * Creates a user profile in Firestore upon first login if it doesn't already exist.
 * Defaults the user role to 'student'.
 * @param {object} user - The Firebase Auth user object.
 */
export const createUserProfileIfNeeded = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        role: 'student', // Default role
        myStudents: [],
        myTeachers: []
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  }
};

/**
 * Fetches a user's profile from Firestore by their UID.
 * @param {string} uid - The user's UID.
 * @returns {object|null} The user profile data or null if not found.
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
};

/**
 * Finds a user profile in Firestore by their email address.
 * @param {string} email - The user's email.
 * @returns {object|null} The user profile data or null if not found.
 */
export const findUserByEmail = async (email) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  // Assuming emails are unique for users
  return querySnapshot.docs[0].data();
};

/**
 * Creates an association between a student and a teacher.
 * @param {string} studentUid - The student's UID.
 * @param {string} teacherEmail - The teacher's email address.
 */
export const addTeacherForStudent = async (studentUid, teacherEmail) => {
  const teacher = await findUserByEmail(teacherEmail);

  if (!teacher) {
    throw new Error("No user found with that email address.");
  }
  if (teacher.role !== 'teacher') {
    throw new Error("The user with this email is not a teacher.");
  }
  
  const teacherUid = teacher.uid;
  
  // Add teacher to student's 'myTeachers' array
  const studentRef = doc(db, "users", studentUid);
  await updateDoc(studentRef, {
    myTeachers: arrayUnion(teacherUid)
  });

  // Add student to teacher's 'myStudents' array
  const teacherRef = doc(db, "users", teacherUid);
  await updateDoc(teacherRef, {
    myStudents: arrayUnion(studentUid)
  });
};
