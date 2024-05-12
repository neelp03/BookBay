import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0); // used to trigger refresh
    const user = auth.currentUser;

    const createConversation = async (participantId) => {
        if (!user) return null; // guard clause if user is not logged in

        const conversationRef = collection(db, 'conversations');
        const q = query(conversationRef, where('participants', 'array-contains', user.uid));

        const querySnapshot = await getDocs(q);
        let existingConversation = null;

        querySnapshot.forEach((doc) => {
            if (doc.data().participants.includes(participantId)) {
                existingConversation = { id: doc.id, ...doc.data() };
            }
        });

        if (!existingConversation) {
            const newConversation = {
                participants: [user.uid, participantId],
                createdAt: new Date(),
                lastMessage: {}
            };
            const docRef = await addDoc(conversationRef, newConversation);
            return { id: docRef.id, ...newConversation };
        } else {
            return existingConversation;
        }
    };

    const sendMessage = async (conversationId, text) => {
        const messageRef = collection(db, `conversations/${conversationId}/messages`);
        const message = {
            senderId: user.uid,
            text,
            createdAt: new Date(),
            read: false
        };

        await addDoc(messageRef, message);

        const conversationDocRef = doc(db, `conversations/${conversationId}`);
        await updateDoc(conversationDocRef, {
            lastMessage: {
                text,
                createdAt: new Date(),
                senderId: user.uid
            }
        }).then(() => {
            console.log('Last message updated successfully');
        }).catch(error => {
            console.error('Failed to update last message:', error);
        });
    };

    const fetchMessages = (conversationId) => {
        const messagesRef = collection(db, `conversations/${conversationId}/messages`);
        return onSnapshot(query(messagesRef, orderBy('createdAt', 'asc')),
            (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(prev => ({ ...prev, [conversationId]: msgs }));
            });
    };

    const markMessagesAsRead = async (conversationId) => {
        const messagesRef = collection(db, `conversations/${conversationId}/messages`);
        const unreadMessagesQuery = query(messagesRef, where('read', '==', false), where('senderId', '!=', user.uid));
        const querySnapshot = await getDocs(unreadMessagesQuery);
        querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, { read: true });
        });
    };

    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid)),
            (snapshot) => {
                const convos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setConversations(convos);
                setLoading(false);
            });
        return () => unsubscribe();
    }, [user, refreshKey]); // Depend on refreshKey to allow refresh

    return (
        <MessageContext.Provider value={{
            conversations,
            messages,
            loading,
            createConversation,
            sendMessage,
            fetchMessages,
            markMessagesAsRead,
            refreshConversations: () => setRefreshKey(oldKey => oldKey + 1),
        }}>
            {children}
        </MessageContext.Provider>
    );
};
