/**
 * @file AuthProvider.js
 * @description A React context provider component for managing book-related data and operations.
 */

// Import necessary React hooks and Firebase Firestore methods
import React, { createContext, useEffect, useState, useCallback } from "react";
import {
  collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc
} from "firebase/firestore";
import { db } from "../../firebase.config"; // Firebase configuration and initialization

// Create a context for managing book data
const BookContext = createContext();

/**
 * Provides a context for accessing and manipulating book data stored in Firestore.
 * 
 * @param {Object} children - Child components that consume the context.
 * @returns {JSX.Element} - A context provider component.
 */
const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]); // State to store the list of books
  const [interest, setInterest] = useState([]); // State to store user interests
  const [loading, setLoading] = useState(true); // State to manage loading status

  // Fetch all books from Firestore and update local state
  const fetchBooks = async () => {
    setLoading(true);
    const booksCollectionRef = collection(db, "books"); // Reference to the books collection in Firestore
    const snapshot = await getDocs(booksCollectionRef);
    const fetchedBooks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(fetchedBooks);
    setLoading(false);
  };

  // Search books by title or author
  const searchBooks = async (searchQuery, field) => {
    setLoading(true);
    const booksQuery = query(
      collection(db, "books"),
      where(field, ">=", searchQuery),
      where(field, "<=", searchQuery + '\uf8ff') // Firestore query to include strings that start with the searchQuery
    );
    const snapshot = await getDocs(booksQuery);
    const searchedBooks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(searchedBooks);
    setLoading(false);
  };

  // Add interest for a book to Firestore
  const addInterest = async (isbn, userId) => {
    const interestsRef = collection(db, "book_interests");
    const existingInterestQuery = query(interestsRef, where("isbn", "==", isbn), where("userId", "==", userId));
    const snapshot = await getDocs(existingInterestQuery);

    if (snapshot.empty) {
      await addDoc(interestsRef, {
        isbn,
        userId,
        timestamp: new Date()
      });
      console.log("Interest added for user:", userId, "for ISBN:", isbn);
    } else {
      console.log("Interest already exists for this user and ISBN.");
    }
  };

  // Get all interests for a user
  const getInterest = async (userId) => {
    const interestsRef = collection(db, "book_interests");
    const queryRef = query(interestsRef, where("userId", "==", userId));
    const snapshot = await getDocs(queryRef);
    const fetchedInterests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInterest(fetchedInterests);
  };

  // Remove interest for a book
  const removeInterest = async (isbn, userId) => {
    const interestsRef = collection(db, "book_interests");
    const queryRef = query(interestsRef, where("isbn", "==", isbn), where("userId", "==", userId));
    const snapshot = await getDocs(queryRef);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log("Interest removed for user:", userId, "for ISBN:", isbn);
    });
  };

  // Notify all users interested in a book when it becomes available
  const notifyInterestedUsers = async (bookId) => {
    const bookRef = doc(db, "books", bookId);
    const bookSnap = await getDoc(bookRef);
    if (!bookSnap.exists() || !bookSnap.data().status) {
      console.log("No need to notify or book does not exist.");
      return;
    }

    const bookData = bookSnap.data();
    const interestsRef = query(collection(db, "book_interests"), where("isbn", "==", bookData.isbn));
    const interestsSnap = await getDocs(interestsRef);

    interestsSnap.forEach(async (doc) => {
      const notificationRef = collection(db, "notifications");
      await addDoc(notificationRef, {
        userId: doc.data().userId,
        title: 'Book Now Available',
        message: `The book "${bookData.title}" you were interested in is now available.`,
        read: false,
        timestamp: new Date(),
        type: 'book_availability',
        bookId: bookId
      });
    });
  };

  // Refresh the list of books by re-fetching them from Firestore
  const refreshBooks = useCallback(() => {
    fetchBooks();
  }, []);

  // Initial fetch of books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Context provider value setup
  const value = {
    books,
    loading,
    interest,
    refreshBooks,
    searchBooks,
    addBook,
    updateBook,
    removeBook,
    addInterest,
    notifyInterestedUsers,
    getBookById,
    removeInterest,
    getInterest,
  };

  // Provide the context to child components
  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

// Export the BookContext and BookProvider for use in other components
export { BookProvider, BookContext };
