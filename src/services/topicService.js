// src/services/topicService.js
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { createQuiz, deleteQuiz } from './quizService';

export const createTopic = async (topicData) => {
    if (!topicData.quizzes || !Array.isArray(topicData.quizzes)) {
        throw new Error('Topic data must include an array of quizzes.');
    }

    // Create all the quizzes associated with the topic first
    const quizIds = [];
    for (const quiz of topicData.quizzes) {
        const newQuizId = await createQuiz({
            ...quiz,
            authorId: topicData.authorId, // Ensure authorId is passed to quizzes
        });
        quizIds.push(newQuizId);
    }

    // Create the topic document with references to the created quizzes
    const topicPayload = {
        title: topicData.title,
        description: topicData.description,
        content: topicData.content,
        quizIds: quizIds,
        authorId: topicData.authorId,
        timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'topics'), topicPayload);
    return docRef.id;
};

export const getTopics = async () => {
    const querySnapshot = await getDocs(collection(db, 'topics'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTopicById = async (topicId) => {
    const docRef = doc(db, 'topics', topicId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        console.error("No such topic found!");
        return null;
    }
};

export const deleteTopic = async (topicId) => {
    try {
        const topic = await getTopicById(topicId);
        if (topic && topic.quizIds) {
            // Delete all associated quizzes
            for (const quizId of topic.quizIds) {
                await deleteQuiz(quizId);
            }
        }

        // Delete the topic document itself
        const topicRef = doc(db, 'topics', topicId);
        await deleteDoc(topicRef);

        console.log("Topic and all its quizzes deleted successfully.");
    } catch (error) {
        console.error("Failed to delete topic: ", error);
        throw error;
    }
};
