
'use client';

import Link from 'next/link';
import { GraduationCap, LogOut, User, Edit, Users, BookOpen, MessageSquare, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { User as StudentUser } from '@/components/admin/user-management';


type Message = { senderId: number };

// Bu, layout'un client-side'da render edilmesini gerektirir.
// Bu nedenle, aktif link durumunu yönetmek için bir client bileşeni oluşturacağız.
function MobileAction({ title, icon, href, isActive = false, badgeCount }: { title: string; icon: React.ReactNode; href: string; isActive?: boolean, badgeCount?: number; }) {
  const hasUnread = badgeCount && badgeCount > 0;
  return (
      <Link href={href} className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}>
          <div className="relative">
            {icon}
            {(badgeCount !== undefined) && (
              <Badge variant={hasUnread ? 'destructive' : 'secondary'} className="absolute top-0 right-0 h-4 w-4 justify-center p-0 transform -translate-y-1/2 translate-x-1/2">{hasUnread ? badgeCount : 0}</Badge>
            )}
          </div>
          <span className="text-xs mt-1">{title}</span>
      </Link>
  )
}

function MobileNav() {
  const pathname = usePathname();
  const [scopeId, setScopeId] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) return;

    let user: StudentUser | null = null;
    let scope: string | null = null;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('yearbook-users-')) {
        const usersRaw = localStorage.getItem(key);
        if (usersRaw) {
          const users: StudentUser[] = JSON.parse(usersRaw);
          const foundUser = users.find((u: any) => u.email.toLowerCase() === loggedInUserEmail.toLowerCase());
          if (foundUser) {
            user = foundUser;
            scope = key.replace('yearbook-users-', '');
            break;
          }
        }
      }
    }
    
    setCurrentUser(user);
    if(scope) setScopeId(scope);
    
    if (user) {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('messages-')) {
          const ids = key.split('-').slice(1).map(Number);
          if (ids.includes(user.id)) {
            const messagesRaw = localStorage.getItem(key);
            if (messagesRaw) {
              const messages: Message[] = JSON.parse(messagesRaw);
              if (messages.length > 0 && messages[messages.length - 1].senderId !== user.id) {
                count++;
              }
            }
          }
        }
      }
      setUnreadCount(count);
    }

  }, []);

  const messagesHref = `/yearbook/messages?scopeId=${scopeId}`;
  const previewHref = `/yearbook/preview/${scopeId}`;

  return (
    <div className="grid grid-cols-5 gap-1">
      <MobileAction icon={<User />} title="Profilim" href="/profile" isActive={pathname === '/profile'} />
      <MobileAction icon={<Edit />} title="Sayfam" href="/yearbook/my-page" isActive={pathname === '/yearbook/my-page'} />
      <MobileAction icon={<MessageSquare />} title="Mesajlar" href={messagesHref} isActive={pathname === '/yearbook/messages'} badgeCount={unreadCount} />
      <MobileAction icon={<Printer />} title="Sipariş" href="/yearbook/order" isActive={pathname === '/yearbook/order'}/>
      <MobileAction icon={<BookOpen />} title="Yıllık" href={previewHref} isActive={pathname.startsWith('/yearbook/preview')}/>
    </div>
  );
}


export default function YearbookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-secondary">
      {/* Desktop Header */}
      <header className="bg-background border-b sticky top-0 z-10 hidden md:block">
        <div className="container h-16 flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-foreground tracking-tight">
              Dijital Andaç
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="py-6 md:py-10 pb-24 md:pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 md:hidden">
          <MobileNav />
      </footer>
    </div>
  );
}
    

    
