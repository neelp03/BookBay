import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";


export const getProducts = async() => {
  try {
    const bookRef = collection(db,"textbook");
    const bookSnapshot = await getDocs(bookRef)
    const books = bookSnapshot.docs.map(doc=>({id:doc.id,...doc.data()}))
    return books;
  } catch (error) {
    console.error(error)
  }
}

export const getProductById = async (productId)=>{
  try {
    console.log("prod",productId)
    const bookRef = doc(db,"book",productId)
    const bookSnapshot = await getDoc(bookRef)
    const book = {id: bookSnapshot.id,...bookSnapshot.data()}
    return book;
  } catch (error) {
    console.error(error)
  }
}