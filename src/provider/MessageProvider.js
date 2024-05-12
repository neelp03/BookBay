// Import necessary React hooks and Firebase Firestore methods
import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';

// Create a context for messaging
const MessageContext = createContext();

// Hook for consuming the message context easily
export const useMessage = () => useContext(MessageContext);

// Provides context for managing messaging functionality
export const MessageProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]); // Store conversations
    const [messages, setMessages] = useState({}); // Store messages for each conversation
    const [loading, setLoading] = useState(true); // Manage loading state
    const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh of conversations
    const user = auth.currentUser; // Current authenticated user

    // Create a new conversation with another user
    const createConversation = async (participantId) => {
        if (!user) return null; // Guard clause if no user is logged in

        const conversationRef = collection(db, 'conversations');
        const q = query(conversationRef, where('participants', 'array-contains', user.uid));

        const querySnapshot = await getDocs(q);
        let existingConversation = null;

        // Check if a conversation with the specified participant already exists
        querySnapshot.forEach((doc) => {
            if (doc.data().participants.includes(participantId)) {
                existingConversation = { id: doc.id, ...doc.data() };
            }
        });

        // Create a new conversation if it doesn't exist
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

    // Send a message in a conversation
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

    // Fetch all messages for a conversation
    const fetchMessages = (conversationId) => {
        const messagesRef = collection(db, `conversations/${conversationId}/messages`);
        return onSnapshot(query(messagesRef, orderBy('createdAt', 'asc')),
            (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(prev => ({ ...prev, [conversationId]: msgs }));
            });
    };

    // Mark all unread messages in a conversation as read
    const markMessagesAsRead = async (conversationId) => {
        const messagesRef = collection(db, `conversations/${conversationId}/messages`);
        const unreadMessagesQuery = query(messagesRef, where('read', '==', false), where('senderId', '!=', user.uid));
        const querySnapshot = await getDocs(unreadMessagesQuery);
        querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, { read: true });
        });
    };

    // Listen for updates to conversations involving the current user
    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid)),
            (snapshot) => {
                const convos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setConversations(convos);
                setLoading(false);
            });
        return () => unsubscribe();
    }, [user, refreshKey]); // Refresh when user changes or when refreshKey changes

    // Return the context provider with exposed context values
    return (
        <MessageContext.Provider value={{
            conversations,
            messages,
            loading,
            createConversation,
            sendMessage,
            fetchMessages,
            markMessagesAsRead,
            refreshConversations: () => setRefreshKey(oldKey => oldKey + 1), // Method to trigger a refresh of conversations
        }}>
            {children}
        </MessageContext.Provider>
    );
};
