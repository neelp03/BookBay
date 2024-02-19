// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAeW24zq91kIWlsRhpa328frEQL41ioXk",
  authDomain: "bookbay-1359c.firebaseapp.com",
  projectId: "bookbay-1359c",
  storageBucket: "bookbay-1359c.appspot.com",
  messagingSenderId: "103316418748",
  appId: "1:103316418748:web:77ca218a321813907ae0b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
export {auth,db}