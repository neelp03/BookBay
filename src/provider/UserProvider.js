/**
 * @file UserProvider.js
 * @description A React context provider component for managing user data.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

/**
 * @typedef User
 * @property {string} uid - The unique identifier of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} phoneNo - The phone number of the user.
 */

/**
 * @typedef UserContextValue
 * @property {User|null} userInfo - The authenticated user's information.
 * @property {boolean} loading - Indicates if the user data is being loaded.
 */

/**
 * @type {React.Context<UserContextValue>}
 */
const UserContext = createContext();

/**
 * Custom hook to use the UserContext
 * @returns {UserContextValue}
 */
export const useUser = () => useContext(UserContext);

/**
 * A React context provider component for managing user data.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactNode} The rendered component.
 */
const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  /**
   * Fetches the user data from the Firestore database.
   * @returns {Promise<void>} A promise that resolves when the user data is fetched.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserInfo({ uid: user.uid, ...userDoc.data() });
          } else {
            console.error("No user data available");
            setUserInfo(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * The value provided by the UserProvider context.
   * @type {UserContextValue}
   */
  const value = { userInfo, loading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserProvider };
