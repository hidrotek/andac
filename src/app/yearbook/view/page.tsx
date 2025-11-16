
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/components/admin/user-management';
import { Loader2 } from 'lucide-react';


export default function ViewYearbookPage() {
  const router = useRouter();

  useEffect(() => {
    // Bu sayfa artık sadece bir yönlendirici.
    // Kullanıcının scopeId'sini bulup doğru önizleme sayfasına yönlendirir.
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
      router.push('/login');
      return;
    }

    let scopeId: string | null = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('yearbook-users-')) {
        const usersRaw = localStorage.getItem(key);
        if (usersRaw) {
          const users: User[] = JSON.parse(usersRaw);
          const user = users.find(u => u.email.toLowerCase() === loggedInUserEmail.toLowerCase());
          if (user) {
            scopeId = key.replace('yearbook-users-', '');
            break;
          }
        }
      }
    }
    
    if (scopeId) {
      router.replace(`/yearbook/preview/${scopeId}`);
    } else {
      // scopeId bulunamazsa profiline geri yönlendir.
      router.replace('/profile');
    }
  }, [router]);


  return (
    <div className="flex h-[50vh] w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg">Yıllık yükleniyor, lütfen bekleyin...</p>
    </div>
  );
}
