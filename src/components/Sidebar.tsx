'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const menuItems = [
  { label: 'Overview', href: '/dashboard/overview' },
  { label: 'Transactions', href: '/dashboard/transactions' },
  { label: 'Budgets', href: '/dashboard/budgets' },
  { label: 'Pots', href: '/dashboard/pots' },
  { label: 'Recurring bills', href: '/dashboard/recurring-bills' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <aside className="w-60 bg-white shadow p-4 flex flex-col justify-between min-h-screen">
      <div>
        <h2 className="text-xl font-bold mb-6">finance</h2>
        <nav className="space-y-2">
          {menuItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded hover:bg-gray-100 ${
                pathname === href ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
        <button
        onClick={handleLogout}
        className="block w-full text-left px-3 py-2 rounded hover:bg-red-100 text-red-600"
        >
        Logout
        </button>
    </aside>
  );
}
