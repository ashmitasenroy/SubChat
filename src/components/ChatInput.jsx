// src/components/ChatInput.jsx
import { useState } from 'react';

// The Send Icon
const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>;

export const ChatInput = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');

  const handleSendMessage = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    // If the user presses Enter but NOT Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line from being added
      handleSendMessage();
    }
  };

  return (
    <div className="chat-input-container">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        rows="1"
        disabled={disabled}
      />
      <button onClick={handleSendMessage} disabled={disabled || !text.trim()}>
        <SendIcon />
      </button>
      <div className="input-instructions">
        Enter to send / Shift+Enter for new line
      </div>
    </div>
  );
};