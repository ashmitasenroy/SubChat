// src/components/AuthForm.jsx
import { useState } from 'react';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Default to Sign In now

  // New state for names
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUpEmailPassword, isLoading: isSigningUp, needsEmailVerification, isError: isSignUpError, error: signUpError } = useSignUpEmailPassword();
  const { signInEmailPassword, isLoading: isSigningIn, isError: isSignInError, error: signInError } = useSignInEmailPassword();

  const handleAuth = (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Pass additional data during sign up
      signUpEmailPassword(email, password, {
        displayName: `${firstName} ${lastName}`.trim(),
        metadata: {
          firstName,
          lastName
        }
      });
    } else {
      signInEmailPassword(email, password);
    }
  };
  
  // NOTE: The "Check your email" screen is not shown in your new design,
  // but the logic remains. We can style it later if needed.
  if (needsEmailVerification) {
     return (
       <div>
         <h2>Success!!</h2>
         <p>We've sent a verification link to your email address.</p>
          <p>Please check your inbox or your spam folder usually it goes there</p>
          <p>Once verified, you can log in with your credentials.</p>
       </div>
     );
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-icon">֎SubChat</div>
        <h1>{isSignUp ? 'Create an account' : 'Let\'s get started now!'}</h1>
        <p>{isSignUp ? 'And start your journey with SubChat' : 'Or create an account if not registered yet'}</p>
      </div>

      <form onSubmit={handleAuth} className="auth-form-body">
        {isSignUp && (
          <div className="name-fields">
            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="input-field">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
        )}

        <div className="input-field">
           <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-field">
          <label htmlFor="password">Password</label>
          <p className="password-hint">Must be at least 8 characters long</p>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {isSignUpError && <p className="error-text">{signUpError?.message}</p>}
        {isSignInError && <p className="error-text">{signInError?.message || 'please check connection and credentials.'}</p>}

        <button type="submit" className="auth-button" disabled={isSigningUp || isSigningIn}>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        <p onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : 'New user here? Create an account'}
        </p>
      </div>
    </div>
  );
};