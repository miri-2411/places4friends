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
      const apiUrl = `${window.location.origin}/api/auth/login`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let payload: any = null;
      const text = await res.text();
      try { payload = text ? JSON.parse(text) : null; } catch { payload = { text }; }

      setLoading(false);
      if (!res.ok) {
        const errMsg = payload?.error || payload?.text || `Login failed (${res.status})`;
        console.error('Login error response:', payload);
        setMessage(errMsg);
      } else {
        setMessage('Logged in successfully');
        window.location.href = '/profile';
      }
    } catch (err) {
      setLoading(false);
      console.error('Login fetch failed:', err);
      setMessage((err as any)?.message || 'Network error');
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
