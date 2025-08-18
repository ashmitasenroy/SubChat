
import './App.css';
import { useAuthenticationStatus } from '@nhost/react';
import { AuthPage } from './pages/AuthPage'; // We will create this
import { ChatPage } from './pages/ChatPage'; // We will create this

// A simple loading screen component
const LoadingScreen = () => (
  <div className="container">
    <p>Loading...</p>
  </div>
);

function App() {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();

  // While Nhost checks the user's session, show a loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If the user is NOT logged in, show the authentication page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // If the user IS logged in, show the main chat page
  return <ChatPage />;
}

export default App;