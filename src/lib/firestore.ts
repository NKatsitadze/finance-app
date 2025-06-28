import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { doc, getDoc } from "firebase/firestore";

type Balance = {
  current: number;
  income: number;
  expenses: number;
};

type BalanceWithId = Balance & { id: string };

export async function fetchUserDocument(userId: string): Promise<BalanceWithId | null> {
  const ref = doc(db, 'users', userId);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id: snapshot.id, ...(snapshot.data() as Balance) } : null;
}

export async function fetchUserSubcollection<T = any>(
  userId: string,
  subcollection: string
): Promise<(T & { id: string })[]> {
  const ref = collection(db, 'users', userId, subcollection);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as (T & { id: string })[];
}
