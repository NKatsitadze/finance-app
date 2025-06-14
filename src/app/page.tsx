'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // adjust path if needed

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/dashboard/overview');
      } else {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return 'loading...'; // or loading spinner if you want
}
