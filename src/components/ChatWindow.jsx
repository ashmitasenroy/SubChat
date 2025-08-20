// src/components/ChatWindow.jsx

import { useEffect, useRef } from 'react';
import { Welcome } from './Welcome';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { gql, useSubscription, useMutation } from '@apollo/client';

// --- GRAPHQL DEFINITIONS ---

// NEW: This query is needed for the refetch to update the sidebar
const GET_CHATS_QUERY = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      title
    }
  }
`;

// 1. A subscription to get all messages for a specific chat in real-time.
const GET_MESSAGES_SUBSCRIPTION = gql`
  subscription GetMessages($chatId: uuid!) {
    messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
      id
      role
      content
      created_at
    }
  }
`;

// 2. A mutation to insert the USER'S message into the database.
const INSERT_USER_MESSAGE_MUTATION = gql`
  mutation InsertUserMessage($chatId: uuid!, $message: String!) {
    insert_messages_one(object: { chat_id: $chatId, content: $message, role: "user" }) {
      id
    }
  }
`;

// 3. The mutation that calls our Hasura Action (and triggers our n8n workflow).
const SEND_MESSAGE_ACTION_MUTATION = gql`
  mutation SendMessageToAction($chatId: uuid!, $message: String!) {
    sendMessage(chat_id: $chatId, message: $message) {
      id 
    }
  }
`;

// 4. NEW: A mutation to update the chat's title.
const UPDATE_CHAT_TITLE_MUTATION = gql`
  mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: { id: $chatId }, _set: { title: $title }) {
      id
      title
    }
  }
`;

// --- COMPONENT ---

export const ChatWindow = ({ selectedChatId }) => {
  const messageListRef = useRef(null);

  // --- HOOKS ---
  const { data, loading, error } = useSubscription(GET_MESSAGES_SUBSCRIPTION, {
    variables: { chatId: selectedChatId },
    skip: !selectedChatId, 
  });

  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE_MUTATION);
  const [sendMessageToAction, { loading: isBotReplying }] = useMutation(SEND_MESSAGE_ACTION_MUTATION);

  // NEW: Instantiate the update title mutation hook.
  // It refetches the GET_CHATS_QUERY to update the sidebar instantly.
  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE_MUTATION, {
    refetchQueries: [{ query: GET_CHATS_QUERY }],
  });

  // --- AUTO-SCROLL LOGIC ---
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [data]);

  // --- CORE FUNCTION ---
  const handleSendMessage = async (messageText) => {
    if (!selectedChatId) return;

    try {
      // --- NEW LOGIC TO UPDATE TITLE ON FIRST MESSAGE ---
      // Check if the 'data' from the subscription exists and if there are no messages yet.
      if (data && data.messages.length === 0) {
        // Create a title from the first 5 words of the message.
        const newTitle = messageText.split(' ').slice(0, 5).join(' ');
        // Call the mutation to update the title.
        await updateChatTitle({
          variables: {
            chatId: selectedChatId,
            title: newTitle,
          },
        });
      }
      // --- END OF NEW LOGIC ---

      // Step 1: Immediately save the user's message to the DB for a snappy UI.
      await insertUserMessage({
        variables: {
          chatId: selectedChatId,
          message: messageText,
        },
      });

      // Step 2: Call the Hasura Action to trigger the n8n workflow.
      sendMessageToAction({
        variables: {
          chatId: selectedChatId,
          message: messageText,
        },
      });

    } catch (err) {
      console.error("Error sending message:", err);
    }
  };


  if (!selectedChatId) {
    return <Welcome />;
  }

  return (
    <div className="chat-window">
      <div className="message-list" ref={messageListRef}>
        {loading && <p className="info-text">Loading messages...</p>}
        {error && <p className="info-text">Error loading messages.</p>}
        {data?.messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isBotReplying && (
          <div className="typing-indicator">SubChat is typing...</div>
        )}
      </div>
      <div className="chat-input-area">
        <ChatInput onSendMessage={handleSendMessage} disabled={isBotReplying} />
      </div>
    </div>
  );
};