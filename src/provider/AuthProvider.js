/**
 * @file AuthProvider.js
 * @description A React context provider component for authentication
 */

// Import necessary React hooks and Firebase authentication methods
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { auth } from "../../firebase.config";  // Import Firebase configuration

// Create a context for authentication
const AuthContext = createContext();

/**
 * AuthProvider component manages authentication state and provides authentication methods to its child components.
 * It uses Firebase to handle user authentication states and actions such as reauthentication and password updates.
 * 
 * @param {React.ReactNode} children - Child components that can consume the AuthContext
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // State to keep track of user's authentication status

  // Effect hook to subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(true);  // Set user as authenticated
      } else { 
        setUser(false);  // Set user as not authenticated
      }
    });

    // Cleanup function to unsubscribe from the auth listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Re-authenticates the current user with their password.
   * Useful for sensitive actions like account deletion or password change.
   * 
   * @param {string} currentPassword - The current password for the user
   * @returns {Promise<{success: boolean, message?: string}>} Promise resolving to an object indicating the success status and an optional error message
   */
  const reauthenticate = async (currentPassword) => {
    const currentUser = getAuth().currentUser;  // Get the currently signed-in user
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);  // Create credential with current email and password
    try {
      await reauthenticateWithCredential(currentUser, credential);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  /**
   * Updates the current user's password to a new password.
   * 
   * @param {string} newPassword - The new password to set
   * @returns {Promise<{success: boolean, message?: string}>} Promise resolving to an object indicating the success status and an optional error message
   */
  const changePassword = async (newPassword) => {
    const currentUser = getAuth().currentUser;  // Get the currently signed-in user
    try {
      await updatePassword(currentUser, newPassword);  // Update password to the new password
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  /**
   * Signs out the current user.
   */
  const signOut = async () => {
    await auth.signOut();
  };

  /**
   * Deletes the current user's account from Firebase Authentication.
   * 
   * @returns {Promise<{success: boolean, message?: string}>} Promise resolving to an object indicating the success status and an optional error message
   */
  const deleteAccount = async () => {
    const currentUser = getAuth().currentUser;  // Get the currently signed-in user
    try {
      await currentUser.delete();  // Delete the user account
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={{ user, reauthenticate, changePassword, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the AuthContext and AuthProvider to be used in other parts of the app
export { AuthContext, AuthProvider };
