// src/components/Welcome.jsx
import { useUserData } from '@nhost/react';

const WelcomeBubble = ({ title, example }) => (
  <div className="welcome-bubble">
    <strong>{title}</strong>
    <p>{example}</p>
  </div>
);

export const Welcome = () => {
  const user = useUserData();
  // Get the first name, or default to 'there'
  const firstName = user?.metadata?.firstName || 'there';

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1>Hi, {firstName}!</h1>
        <h2>How can I help you today?</h2>
      </div>
      <div className="welcome-bubbles-grid">
        <WelcomeBubble title="Ask complex questions" example='"Who won the Nobel Prize for Physics in 2020?"' />
        <WelcomeBubble title="Generate professional content" example='"Write a high-converting landing page headline."' />
      </div>
    </div>
  );
};