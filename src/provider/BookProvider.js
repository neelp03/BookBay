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
   * Update book status
   * @param {string} bookId - Book ID
   * @param {string} status - Book status
   * @returns {Promise<void>} - Promise object
   * @async - Asynchronous function
  */
  const updateBookStatus = async (bookId, status) => {
    const bookRef = doc(db, "books", bookId);
    await updateDoc(bookRef, { status });

    if (status === 'available') {
      notifyInterestedUsers(bookId);
    }
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
   * Notify interested users about book availability
   * @param {string} bookId - Book ID
   * @returns {Promise<void>} - Promise object
   * @async - Asynchronous function
  */
  const notifyInterestedUsers = async (bookId) => {
    const bookRef = doc(db, "books", bookId);
    const bookSnap = await getDoc(bookRef);
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
        timestamp: new Date().toISOString(),
        type: 'book_availability',
        bookId: bookId
      });
    });
  };

  const refreshBooks = useCallback(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  /**
   * Add a book to Firestore
   * @param {Object} book - Book object
   * @returns {Promise<void>} - Promise object
  */
  const addBook = async (book) => {
    await addDoc(collection(db, "books"), book);
    refreshBooks();
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

  const value = {
    books,
    loading,
    refreshBooks,
    searchBooks,
    addBook,
    removeBook,
    updateBookStatus,
    addInterest
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export { BookProvider, BookContext };
