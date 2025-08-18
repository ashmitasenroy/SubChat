// src/components/ChatWindow.jsx

import { useEffect, useRef } from 'react';
import { Welcome } from './Welcome';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { gql, useSubscription, useMutation } from '@apollo/client';

// --- GRAPHQL DEFINITIONS ---

// 1. A subscription to get all messages for a specific chat in real-time.
const GET_MESSAGES_SUBSCRIPTION = gql`
  subscription GetMessages($chatId: uuid!) {
    chats_messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
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
    insert_chats_messages_one(object: { chat_id: $chatId, content: $message, role: "user" }) {
      id
    }
  }
`;

// 3. The mutation that calls our Hasura Action (and triggers our n8n workflow).
const SEND_MESSAGE_ACTION_MUTATION = gql`
  mutation SendMessageToAction($chatId: uuid!, $message: String!) {
    sendMessage(chat_id: $chatId, message: $message) {
      id # We ask for the ID of the bot's response
    }
  }
`;

// --- COMPONENT ---

export const ChatWindow = ({ selectedChatId }) => {
  const messageListRef = useRef(null);

  // --- HOOKS ---
  const { data, loading, error } = useSubscription(GET_MESSAGES_SUBSCRIPTION, {
    variables: { chatId: selectedChatId },
    skip: !selectedChatId, // Don't run the subscription if no chat is selected
  });

  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE_MUTATION);
  const [sendMessageToAction, { loading: isBotReplying }] = useMutation(SEND_MESSAGE_ACTION_MUTATION);


  // --- AUTO-SCROLL LOGIC ---
  useEffect(() => {
    // Scroll to the bottom of the message list whenever new messages arrive
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [data]);


  // --- CORE FUNCTION ---
  const handleSendMessage = async (messageText) => {
    if (!selectedChatId) return;

    try {
      // Step 1: Immediately save the user's message to the DB for a snappy UI.
      await insertUserMessage({
        variables: {
          chatId: selectedChatId,
          message: messageText,
        },
      });

      // Step 2: Call the Hasura Action to trigger the n8n workflow.
      // We don't need to 'await' this fully, we just fire it off.
      // The AI's response will appear automatically thanks to our real-time subscription.
      sendMessageToAction({
        variables: {
          chatId: selectedChatId,
          message: messageText,
        },
      });

    } catch (err) {
      console.error("Error sending message:", err);
      // You could show an error message in the UI here
    }
  };


  // --- RENDER LOGIC ---

  // If no chat is selected, show the welcome screen
  if (!selectedChatId) {
    return <Welcome />;
  }

  return (
    <div className="chat-window">
      <div className="message-list" ref={messageListRef}>
        {loading && <p className="info-text">Loading messages...</p>}
        {error && <p className="info-text">Error loading messages.</p>}
        {data?.chats_messages.map((msg) => (
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