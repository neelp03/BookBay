/**
 * @file BooksProvider.js
 * @description A React context provider component for managing books data.
 */

import React, { createContext, useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
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
   * Searches for books in the database based on the search query and field.
   * @param {string} searchQuery - The search query.
   * @param {string} field - The field to search in.
   * @returns {Promise<void>} A promise that resolves when the books are searched.
   */
  const searchBooks = async (searchQuery, field) => {
    setLoading(true);
    try {
      let booksQuery;
      if (field === "isbn") {
        // Exact matching for ISBN
        booksQuery = query(collection(db, "books"), where(field, "==", searchQuery));
      } else {
        // Partial matching for other fields
        booksQuery = query(
          collection(db, "books"),
          where(field, ">=", searchQuery),
          where(field, "<=", searchQuery + '\uf8ff')
        );
      }

      const snapshot = await getDocs(booksQuery);
      let searchedBooks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (field !== "isbn") {
        // Sorting by relevance only for non-ISBN fields
        searchedBooks.sort((a, b) => Math.abs(a[field].length - searchQuery.length) - Math.abs(b[field].length - searchQuery.length));
      }

      setBooks(searchedBooks);
    } catch (error) {
      console.error("Error searching books:", error);
      setBooks([]);
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
   * Adds a new book to the database.
   * @param {Book} book - The book to add.
   * @returns {Promise<void>}
   */
  const addBook = async (book) => {
    try {
      const booksCollectionRef = collection(db, "books");
      await addDoc(booksCollectionRef, book);
      await fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  /**
   * Removes a book from the database.
   * @param {string} bookId - The ID of the book to remove.
   * @returns {Promise<void>}
   */
  const removeBook = async (bookId) => {
    try {
      const bookRef = doc(db, "books", bookId);
      await deleteDoc(bookRef);
      await fetchBooks();
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  /**
   * The value provided by the BooksProvider context.
   * @type {BookContextValue}
   */
  const value = {
    books,
    loading,
    refreshBooks,
    searchBooks,
    addBook,
    removeBook,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export { BookProvider, BookContext };
