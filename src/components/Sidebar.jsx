// src/components/Sidebar.jsx

import { useUserData, useNhostClient } from '@nhost/react';
import { gql, useQuery } from '@apollo/client';

// Simple SVG Icons
const NewChatIcon = () => <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>;
// The ChatHistoryIcon SVG is no longer used, so we could delete it, but it's fine to leave it.
const ChatHistoryIcon = () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M15 1H9v2h6V1zm-4 13.5c-2.84 0-5.43-1.23-7.26-3.24.26-.58.55-1.14.88-1.68C6.01 10.74 7.94 12 11 12c3.06 0 4.99-1.26 6.38-3.42.33.54.62 1.1.88 1.68C16.43 12.27 13.84 13.5 11 13.5zM20.94 6c-1.46-2.3-3.88-3.95-6.86-4.68.21.32.41.65.59.99C16.49 2.53 18 3.92 19.33 6h1.61zM3.06 6h1.61C6 3.92 7.51 2.53 9.32 2.31c.18-.34.38-.67.59-.99C6.94 2.05 4.52 3.7 3.06 6zM11 15c4.42 0 8-2.69 8-6s-3.58-6-8-6-8 2.69-8 6 3.58 6 8 6z"></path></svg>;
const SignOutIcon = () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M16 17v-3H9v-4h7V7l5 5-5 5zM14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"></path></svg>;

const GET_CHATS_QUERY = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      title
    }
  }
`;

export const Sidebar = ({ onNewChat, onSelectChat }) => {
  const user = useUserData();
  const nhost = useNhostClient();
  const { data, loading, error } = useQuery(GET_CHATS_QUERY);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-button" onClick={onNewChat}>
          <NewChatIcon /> New Chat
        </button>
      </div>
      <div className="chat-history">
        <div className="chat-history-title">Chat History</div>
        {loading && <p>Loading chats...</p>}
        {error && <p>Error loading chats.</p>}
        <ul>
          {data?.chats.map((chat) => (
            <li key={chat.id} onClick={() => onSelectChat(chat.id)}>
              {/* CORRECTED: The icon has been removed from here */}
              <span>{chat.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="user-profile">
        <div className="user-info">
          <div className="user-avatar">{user?.displayName?.charAt(0)}</div>
          <div className="user-details">
            <span className="user-name">{user?.displayName}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
        <button className="sign-out-button" onClick={() => nhost.auth.signOut()}>
          <SignOutIcon />
        </button>
      </div>
    </div>
  );
};