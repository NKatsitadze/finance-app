'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.replace('/dashboard/overview');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
