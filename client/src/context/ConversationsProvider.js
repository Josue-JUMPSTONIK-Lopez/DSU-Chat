import React, {useContext, useState, useEffect, useCallback,} from 'react'
import { useStorage } from '../hooks/useStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';

const ConversationsContext = React.createContext();

export const useConversations = () =>{
    return useContext(ConversationsContext)
}

export const ConversationsProvider = (props) => {
    const [conversations, setConversations] = useStorage('conversations', []);
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
    const {contacts} = useContacts()
    const createConversation = (recipients) =>{
        setConversations( prevConversations =>{
        return [...prevConversations, {recipients, messages: []}]
        })
    };

    const socket = useSocket();

    const formattedConversations = conversations.map((conversation, index) => {
        const recipients = conversation.recipients.map(recipient => {
            const contact = contacts.find(contact => {
            return contact.id === recipient
            })
            const name = (contact && contact.name) || recipient
            return { id: recipient, name }
        })
    
        const messages = conversation.messages.map(message => {
            const contact = contacts.find(contact => {
            return contact.id === message.sender
            })
            const name = (contact && contact.name) || message.sender
            const fromMe = props.id === message.sender
            return { ...message, senderName: name, fromMe }
        })
        // console.log(messages)
        const selected = index === selectedConversationIndex
        return { ...conversation, messages, recipients, selected }
    })

    const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
        setConversations(prevConversations => {
            let madeChange = false
            const newMessage = { sender, text }
            let newConversations = prevConversations.map(conversation => {
            if (arrayEquality(conversation.recipients, recipients)) {
                madeChange = true
                return {
                    ...conversation,
                    messages: [...conversation.messages, newMessage]
                }
            }
            return conversation
        })
        
        if (madeChange) {
            return newConversations
        } else {
            newConversations = [
                ...prevConversations,
                { recipients, messages: [newMessage] }
            ]
            return newConversations
        }
        })
    }, [setConversations])

    useEffect(() => {
        if (socket == null) return
    
        socket.on('receive-message', addMessageToConversation)
    
        return () => socket.off('receive-message')
      }, [socket, addMessageToConversation])
    
    const postMessage = async({ recipients, text, sender }) =>{
        
        const rawResponse = await fetch('http://localhost:4000/messages', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
            body: JSON.stringify({recipients, text, sender})
        });
        const content = await rawResponse.json();
        
        console.log(content);
        
    }

    const sendMessage = (recipients, text) =>{
        socket.emit('send-message', {recipients, text})
        const messageSent = { recipients, text, sender: props.id }
        console.log(messageSent)
        postMessage(messageSent)
        .then()
        addMessageToConversation(messageSent)
    }

    const value = {
        conversations: formattedConversations, 
        selectedConversation: formattedConversations[selectedConversationIndex],
        sendMessage,
        selectConversationindex: setSelectedConversationIndex,
        createConversation
    }

    return (
        <ConversationsContext.Provider value={value}>
        {props.children}
        </ConversationsContext.Provider>
    )
}

const arrayEquality = (a, b) =>{
    if(a.length !== b.length){
        return false
    }

    a.sort();
    b.sort();

    return a.every( (elem, index) =>{
        return elem === b[index];
    })
}