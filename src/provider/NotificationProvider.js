// Import necessary React hooks and Firebase methods
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../../firebase.config'; 
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Create a context for notifications
const NotificationContext = createContext();

// Hook for consuming the notification context easily
export const useNotifications = () => useContext(NotificationContext);

// Provides context for managing notification functionality
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [unsubscribeNotifications, setUnsubscribeNotifications] = useState(null); // Function to unsubscribe from notification updates

  useEffect(() => {
    // Listen for authentication state changes to fetch or clear notifications
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Query to fetch notifications for the logged-in user
        const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const notifs = [];
          // Iterate over each document and store the notification data
          querySnapshot.forEach((doc) => {
            notifs.push({ id: doc.id, ...doc.data() });
          });
          setNotifications(notifs);
          setLoading(false);
        }, (error) => {
          setLoading(false); // Handle errors and stop loading
        });
        setUnsubscribeNotifications(() => unsubscribe); // Store the unsubscribe function
      } else {
        // Clear notifications and unsubscribe if the user logs out
        if (unsubscribeNotifications) {
          unsubscribeNotifications();
          setUnsubscribeNotifications(null);
        }
        setNotifications([]);
        setLoading(false);
      }
    });

    // Cleanup function to unsubscribe from auth changes and notifications when the component unmounts
    return () => {
      authUnsubscribe();
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, []);

  // Function to mark a notification as read
  const markAsRead = async (notificationId) => {
    const notifDoc = doc(db, "notifications", notificationId);
    await updateDoc(notifDoc, { read: true }); // Update the 'read' status in the database
  };

  // Function to refresh notifications manually
  const refreshNotifications = () => {
    setLoading(true); // Set loading to true during the refresh
    // Unsubscribe and clear the unsubscribe function if it exists
    if (unsubscribeNotifications) {
      unsubscribeNotifications();
      setUnsubscribeNotifications(null);
    }
  };

  // Context provider passing down notification data and functions
  return (
    <NotificationContext.Provider value={{ notifications, loading, markAsRead, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
