import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../../firebase.config'; 
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
 */export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  const fetchNotifications = () => {
    if(!currentUser) {
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid)
    );

    return onSnapshot(q, (querySnapshot) => {
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
  };

  useEffect(() => {
    const unsubscribe = fetchNotifications();
    return () => unsubscribe && unsubscribe();
  }, []);

  const refreshNotifications = () => {
    setLoading(true);
    const unsubscribe = fetchNotifications();
    return () => unsubscribe && unsubscribe();
  };

  const markAsRead = async (notificationId) => {
    const notifDoc = doc(db, "notifications", notificationId);
    await updateDoc(notifDoc, { read: true });
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, markAsRead, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
