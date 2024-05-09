import React, { createContext, useEffect, useState, useCallback } from "react";
import {
  collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc
} from "firebase/firestore";
import { db } from "../../firebase.config";

const BookContext = createContext();

/**
 * Provider component for managing book data
 * @param {Object} children - React component children
 * @returns {JSX.Element} BookProvider component
*/
const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all books from Firestore
   * @returns {Promise<void>} - Promise object
   * @async - Asynchronous function
  */
  const fetchBooks = async () => {
    setLoading(true);
    const booksCollectionRef = collection(db, "books");
    const snapshot = await getDocs(booksCollectionRef);
    const fetchedBooks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(fetchedBooks);
    setLoading(false);
  };

  /**
   * Search books by title or author
   * @param {string} searchQuery - Search query
   * @param {string} field - Field to search in
   * @returns {Promise<void>} - Promise object
   * @async - Asynchronous function
  */
  const searchBooks = async (searchQuery, field) => {
    setLoading(true);
    const booksQuery = query(
      collection(db, "books"),
      where(field, ">=", searchQuery),
      where(field, "<=", searchQuery + '\uf8ff')
    );
    const snapshot = await getDocs(booksQuery);
    const searchedBooks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(searchedBooks);
    setLoading(false);
  };

  /**
   * Add interest for a book
   * @param {string} isbn - ISBN of the book
   * @param {string} userId - User ID
   * @returns {Promise<void>} - Promise object
  */
  const addInterest = async (isbn, userId) => {
    const interestsRef = collection(db, "book_interests");
    const existingInterestQuery = query(interestsRef, where("isbn", "==", isbn), where("userId", "==", userId));
    const snapshot = await getDocs(existingInterestQuery);

    if (snapshot.empty) { // Only add new interest if it doesn't already exist
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

  /**
   * Notify interested users about a book
   * @param {string} bookId - Book ID
   * @returns {Promise<void>} - Promise object
   * @async - Asynchronous function
   */
  const notifyInterestedUsers = async (bookId) => {
    const bookRef = doc(db, "books", bookId);
    const bookSnap = await getDoc(bookRef);
    if (!bookSnap.exists() || bookSnap.data().status !== "available") {
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

  /**
 * Add a book to Firestore
 * @param {Object} book - Book object
 * @returns {Promise<void>} - Promise object
*/
  const addBook = async (book) => {
    try {
      const newDocRef = await addDoc(collection(db, "books"), book);
      if (book.status === "available") {
        await notifyInterestedUsers(newDocRef.id)
          .catch((error) => {
            console.error("Error notifying interested users: ", error);
          });
      }
      console.log("Book added with ID:", newDocRef.id);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  /**
   * Update a book in Firestore
   * @param {string} bookId - Book ID
   * @param {Object} updatedData - Updated book data
   * @returns {Promise<void>} - Promise object
  */
  const updateBook = async (bookId, updatedData) => {
    const bookRef = doc(db, "books", bookId);
    try {
      await updateDoc(bookRef, updatedData);
      console.log("Book updated:", bookId);
      refreshBooks();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };  
  
  /**
   * Remove a book from Firestore
   * @param {string} bookId - Book ID
   * @returns {Promise<void>}
  */
  const removeBook = async (bookId) => {
    await deleteDoc(doc(db, "books", bookId));
    refreshBooks();
  };

  /**
   * Get a book by ID
   * @param {string} bookId - Book ID
   * @returns {Promise<Object>} - Book object`
  */
  const getBookById = async (bookId) => {
  const bookRef = doc(db, "books", bookId);
  const bookSnap = await getDoc(bookRef);
  if (bookSnap.exists()) {
    return {
      id: bookSnap.id,
      ...bookSnap.data()
    };
  } else {
    console.log("No such book exists.");
    return null;
  }
};

  const refreshBooks = useCallback(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  const value = {
    books,
    loading,
    refreshBooks,
    searchBooks,
    addBook,
    updateBook,
    removeBook,
    addInterest,
    notifyInterestedUsers,
    getBookById,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export { BookProvider, BookContext };
