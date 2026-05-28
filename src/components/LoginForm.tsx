"use client";
import React, { useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Use custom server-side login which validates against hashed DB
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      setLoading(false);
      if (!res.ok) {
        setMessage(json.error || 'Login failed');
      } else {
        // store token if returned
        // token is set as httpOnly cookie by server; no localStorage needed
        setMessage('Logged in successfully');
        // redirect to profile
        window.location.href = '/profile';
      }
    } catch (err) {
      setLoading(false);
      setMessage('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        className="w-full p-2 border rounded"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        className="w-full p-2 border rounded"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="px-4 py-2 bg-slate-800 text-white rounded" type="submit" disabled={loading}>
        {loading ? 'Logging in…' : 'Log in'}
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
}
