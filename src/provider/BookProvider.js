/**
 * @file BooksProvider.js
 * @description A React context provider component for managing books data.
 */

import React, { createContext, useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore"; // Importing required functions
import { db } from "../../firebase.config";

/**
 * @typedef Book
 * @property {string} id - The unique identifier of the book.
 * @property {string} title - The title of the book.
 * @property {string} author - The author of the book.
 * @property {number} price - The price of the book.
 */

/**
 * @typedef BookContextValue
 * @property {Book[]} books - The array of books.
 * @property {boolean} loading - Indicates if the books are being loaded.
 */

/**
 * @type {React.Context<BookContextValue>}
 */
const BookContext = createContext();

/**
 * A React context provider component for managing books data.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactNode} The rendered component.
 */
const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the books data from the database.
   * @returns {Promise<void>} A promise that resolves when the books are fetched.
   */
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksCollectionRef = collection(db, "books"); // Getting a reference to the 'books' collection
      const snapshot = await getDocs(booksCollectionRef); // Fetching documents from the collection
      const fetchedBooks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refreshes the books data by fetching it from the database.
   * @returns {Promise<void>} A promise that resolves when the books are refreshed.
   */
  const refreshBooks = useCallback(() => {
    return fetchBooks();
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  /**
   * The value provided by the BooksProvider context.
   * @type {BookContextValue}
   */
  const value = {
    books,
    loading,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export { BookProvider, BookContext };
