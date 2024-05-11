import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    const createOrGetConversation = async (participantId) => {
        const conversationRef = collection(db, 'conversations');
        const q = query(conversationRef, where('participants', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        let existingConversation = querySnapshot.docs.find(doc => doc.data().participants.includes(participantId));

        if (!existingConversation) {
            const newConversation = {
                participants: [user.uid, participantId],
                createdAt: new Date(),
                lastMessage: {}
            };
            const docRef = await addDoc(conversationRef, newConversation);
            return { id: docRef.id, ...newConversation };
        }
        return { id: existingConversation.id, ...existingConversation.data() };
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
        await updateDoc(doc(db, `conversations/${conversationId}`), {
            lastMessage: { text, createdAt: new Date() }
        });
    };

    const fetchMessages = (conversationId) => {
        const messagesRef = collection(db, `conversations/${conversationId}/messages`);
        const unsubscribe = onSnapshot(query(messagesRef, orderBy('createdAt', 'asc')),
            (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(prev => ({ ...prev, [conversationId]: msgs }));
            });
        return () => unsubscribe();
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
        return () => unsubscribe(); // Cleanup on unmount
    }, [user]);

    return (
        <MessageContext.Provider value={{
            conversations,
            messages,
            loading,
            createOrGetConversation,
            sendMessage,
            fetchMessages,
            markMessagesAsRead
        }}>
            {children}
        </MessageContext.Provider>
    );
};
