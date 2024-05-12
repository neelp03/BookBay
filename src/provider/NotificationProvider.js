import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../../firebase.config'; 
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribeNotifications, setUnsubscribeNotifications] = useState(null);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const notifs = [];
          querySnapshot.forEach((doc) => {
            notifs.push({ id: doc.id, ...doc.data() });
          });
          setNotifications(notifs);
          setLoading(false);
        }, (error) => {
          setLoading(false);
        });
        setUnsubscribeNotifications(() => unsubscribe);
      } else {
        if (unsubscribeNotifications) {
          unsubscribeNotifications();
          setUnsubscribeNotifications(null);
        }
        setNotifications([]);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, []);

  const markAsRead = async (notificationId) => {
    const notifDoc = doc(db, "notifications", notificationId);
    await updateDoc(notifDoc, { read: true });
  };

  const refreshNotifications = () => {
    setLoading(true);
    // Trigger a re-fetch if needed
    if (unsubscribeNotifications) {
      unsubscribeNotifications();
      setUnsubscribeNotifications(null);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, markAsRead, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
