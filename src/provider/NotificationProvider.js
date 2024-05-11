import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, auth } from '../../firebase.config'; 
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);  // Added to trigger useEffect
  const currentUser = auth.currentUser;

  const fetchNotifications = useCallback(() => {
    if (!currentUser) {
      setLoading(false);
      return undefined; 
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

  }, [currentUser?.uid]);  // Dependency on currentUser.uid

  useEffect(() => {
    const unsubscribe = fetchNotifications();
    return () => unsubscribe && unsubscribe();
  }, [fetchNotifications, refreshKey]);  // Depend on refreshKey to allow manual refresh

  const markAsRead = async (notificationId) => {
    const notifDoc = doc(db, "notifications", notificationId);
    await updateDoc(notifDoc, { read: true });
  };

  const refreshNotifications = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, markAsRead, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
