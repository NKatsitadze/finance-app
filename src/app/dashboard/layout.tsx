// src/app/dashboard/layout.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Sidebar from '@/components/Sidebar'; // Assuming this is your panel menu component

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return <div className="p-4">Checking authentication...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar /> {/* Left panel */}
      <main className="flex-1 p-4">{children}</main> {/* Right side content */}
    </div>
  );
}
