import React, { useState } from 'react';
import { registerUser } from '../api/api';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser({ username, password });
      if (response.status === 201) {
        const sessionId = response.headers['session-id'];
        localStorage.setItem('sessionId', sessionId);
        setMessage('Registration successful!');
        onRegister(); 
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage('Username already exists. Please choose another one.');
      }
      else if (error.response?.status === 400) {
        setMessage('Bad request. Please fill out all fields correctly.');
      } else {
        setMessage('An error occurred during registration.');
        console.error('Error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;