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
        role: 'student', // Default role for now, can be used for admin later
        following: [], // Users this user is following (their "teachers")
        followers: []  // Users following this user (their "students")
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
  return querySnapshot.docs[0].data();
};

/**
 * Allows the current user to follow another user, enabling them to see the current user's results.
 * @param {string} currentUserUid - The UID of the user initiating the follow.
 * @param {string} emailToFollow - The email address of the user to follow.
 */
export const addUserToFollow = async (currentUserUid, emailToFollow) => {
  const userToFollow = await findUserByEmail(emailToFollow);

  if (!userToFollow) {
    throw new Error("No user found with that email address.");
  }
  
  const userToFollowUid = userToFollow.uid;
  
  // Add the followed user to the current user's 'following' array
  const currentUserRef = doc(db, "users", currentUserUid);
  await updateDoc(currentUserRef, {
    following: arrayUnion(userToFollowUid)
  });

  // Add the current user to the other user's 'followers' array
  const userToFollowRef = doc(db, "users", userToFollowUid);
  await updateDoc(userToFollowRef, {
    followers: arrayUnion(currentUserUid)
  });
};
