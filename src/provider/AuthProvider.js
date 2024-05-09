/**
 * @file AuthProvider.js
 * @description A React context provider component for authentication
 */

import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { auth } from "../../firebase.config";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const reauthenticate = async (currentPassword) => {
    const currentUser = getAuth().currentUser;
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    try {
      await reauthenticateWithCredential(currentUser, credential);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const changePassword = async (newPassword) => {
    const currentUser = getAuth().currentUser;
    try {
      await updatePassword(currentUser, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, reauthenticate, changePassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
