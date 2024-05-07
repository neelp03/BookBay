import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase.config'; 
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const NotificationContext = createContext();

/**
 * useNotifications
 * @returns {Object} Notifications context
 * @returns {Array} notifications - List of notifications
 * @returns {Boolean} loading - Loading state
 * @returns {Function} markAsRead - Mark a notification as read
 */
export const useNotifications = () => useContext(NotificationContext);

/**
 * NotificationProvider
 * @param {Object} props - Component props
 * @param {Object} props.children - Component children
 * @returns {JSX.Element} NotificationProvider component
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if(!currentUser) {
      return;
    }
    const q = query(
      collection(db, "notifications"),
      where("read", "==", false),
      where("userId", "==", currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs = [];
      querySnapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(notifs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notifications: ", error);
      setLoading(false);
    });    

    return () => unsubscribe(); // Detach listener on unmount
  }, []);

  const markAsRead = async (notificationId) => {
    const notifDoc = doc(db, "notifications", notificationId);
    await updateDoc(notifDoc, { read: true });
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
