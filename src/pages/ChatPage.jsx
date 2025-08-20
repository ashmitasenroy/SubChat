// src/pages/ChatPage.jsx

import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatWindow } from '../components/ChatWindow';
import { gql, useMutation } from '@apollo/client';

const CREATE_CHAT_MUTATION = gql`
  mutation CreateChat {
    insert_chats_one(object: {}) {
      id
    }
  }
`;

// CORRECTED: 'title' has been removed and only 'id' is requested.
const GET_CHATS_QUERY = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
    }
  }
`;

export const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  const [createChat] = useMutation(CREATE_CHAT_MUTATION, {
    refetchQueries: [{ query: GET_CHATS_QUERY }],
  });

  const handleNewChat = async () => {
    try {
      const result = await createChat();
      const newChatId = result.data.insert_chats_one.id;
      
      setSelectedChatId(newChatId);

    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };
  
  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="chat-layout">
      <Sidebar onNewChat={handleNewChat} onSelectChat={handleSelectChat} />
      <main className="main-content">
        <ChatWindow selectedChatId={selectedChatId} />
      </main>
    </div>
  );
};