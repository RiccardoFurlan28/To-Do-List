import React, { useState } from 'react';
import { loginUser } from '../api/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser({ username, password })
      .then(response => {
        const user = response.data;
        localStorage.setItem('user', JSON.stringify(user)); // Store user in local storage
        onLogin(user);
      })
      .catch(error => {
        if (error.response?.status === 401) {
          setErrorMessage('Invalid username or password. Please try again.');
        } else {
          console.error('Error logging in:', error);
          setErrorMessage('An error occurred during login. Please try again later.');
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;