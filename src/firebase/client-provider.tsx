'use client';

import { useState, useEffect, useMemo } from 'react';
import { initializeFirebase } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // Firebase'i sadece bir kez, bileşen yüklendiğinde başlat
    const firebase = initializeFirebase();
    setInstances(firebase);
  }, []);

  // instances null ise, Firebase başlatılırken bir yükleme durumu göster
  if (!instances) {
    // Veya bir yükleme göstergesi döndürebilirsiniz
    return null; 
  }

  return (
    <FirebaseProvider
      app={instances.app}
      auth={instances.auth}
      firestore={instances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
