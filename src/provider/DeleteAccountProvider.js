import { db } from "../../firebase.config";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  writeBatch
} from "firebase/firestore";

export const removeAllUserData = async (userId) => {
  const batch = writeBatch(db);

  // Helper function to delete documents from a given collection
  const deleteFromCollection = async (collectionName) => {
    const q = query(collection(db, collectionName), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
  };

  // Delete user's books
  await deleteFromCollection("books");
  // Delete user's interests
  await deleteFromCollection("book_interests");
  // Delete user's notifications
  await deleteFromCollection("notifications");
  // Delete user's messages (if applicable, adjust the query if messages are structured differently)
  await deleteFromCollection("messages");

  // Commit the batch
  await batch.commit();
};
