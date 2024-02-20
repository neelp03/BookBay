import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";


export const getBooks = async () => {
  try {
    const booksRef = collection(db, "books");
    const booksSnapshot = await getDocs(booksref)
    const books = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return books;
  } catch (error) {
    console.error(error)
  }
}

export const getBooksById = async (booksId) => {
  try {
    console.log("books", bookId)
    const booksRef = doc(db, "books", booksId)
    const booksSnapshot = await getDoc(booksRef)
    const books = { id: booksSnapshot.id, ...booksSnapshot.data() }
    return books;
  } catch (error) {
    console.error(error)
  }
}