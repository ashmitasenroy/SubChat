// src/components/AuthForm.jsx
import { useState } from 'react';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUpEmailPassword, isLoading: isSigningUp, needsEmailVerification, isError: isSignUpError, error: signUpError } = useSignUpEmailPassword();
  const { signInEmailPassword, isLoading: isSigningIn, isError: isSignInError, error: signInError } = useSignInEmailPassword();

  const handleAuth = (e) => {
    e.preventDefault();
    if (isSignUp) {
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

  // --- MODIFIED SUCCESS MESSAGE BLOCK ---
    if (needsEmailVerification) {
  return (
    <div className="auth-card">
      <div className="message-box">
        <img src="/email-icon.png" alt="Email Sent Icon" />
        <h2>Verification Email Sent!</h2>
        <p>
          <strong>{email}</strong>.
        </p>
        <p>
          Please check your inbox (and spam folder).
        </p>
        <p>Once verified, you can sign in.</p>
        <p>
          If the verification link doesn't bring you back here,
          <br />
          <span style={{ color: '#2b6cb0', fontWeight: 500 }}>
            click the button below to reload the page.
          </span>
        </p>
        <button className="cta-button" onClick={() => window.location.reload()}>
          I’ve Verified My Email
        </button>
        <p className="redirect-info">
          Already verified?
          <span className="sign-in-link" onClick={() => window.location.reload()}>
            Sign in again
          </span>
        </p>
      </div>
    </div>
  );
}


  // --- END OF MODIFIED BLOCK ---      

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