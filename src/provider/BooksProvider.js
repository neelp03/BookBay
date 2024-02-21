import { createContext, useEffect, useState } from 'react';
import { firestore } from '../firebase';

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('books').onSnapshot((snapshot) => {
      const booksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BooksContext.Provider value={books}>{children}</BooksContext.Provider>
  );
};
