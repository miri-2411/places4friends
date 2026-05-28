"use client";
import { useEffect } from 'react';

export default function AuthCleaner() {
  useEffect(() => {
    // Remove any legacy/local placeholder tokens
    try {
      localStorage.removeItem('token');
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}
