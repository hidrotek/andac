
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import type { User } from '@/lib/types';

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  claims: { [key: string]: any } | null;
}

export function useUser(): AuthState {
  const auth = useAuth();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const idTokenResult = await user.getIdTokenResult();
        setClaims(idTokenResult.claims);
      } else {
        setUser(null);
        setClaims(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading, claims };
}
