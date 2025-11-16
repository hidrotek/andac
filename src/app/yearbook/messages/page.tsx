
'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/components/admin/user-management';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Message = {
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string;
};

function MessagesPageComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scopeId = searchParams.get('scopeId');
  const initialFriendId = searchParams.get('friendId');

  const [friends, setFriends] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : name.substring(0, 2);
  };
  
  // Load current user and friends list
  useEffect(() => {
    const email = localStorage.getItem('loggedInUserEmail');
    if (!email || !scopeId) {
        toast({ variant: 'destructive', title: 'Hata', description: 'Kullanıcı bilgileri veya grup kimliği bulunamadı.' });
        router.push('/profile');
        return;
    }

    const usersKey = `yearbook-users-${scopeId}`;
    const storedUsersRaw = localStorage.getItem(usersKey);
    if (storedUsersRaw) {
      const allUsers: User[] = JSON.parse(storedUsersRaw);
      const loggedInUser = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      setCurrentUser(loggedInUser || null);
      const otherUsers = allUsers.filter(user => user.registered && user.email.toLowerCase() !== email.toLowerCase());
      setFriends(otherUsers);

       if (initialFriendId) {
        const friend = otherUsers.find(f => f.id.toString() === initialFriendId);
        if (friend) {
          setSelectedFriend(friend);
        }
      }
    }
  }, [scopeId, initialFriendId, router, toast]);

  // Load messages when a friend is selected
  useEffect(() => {
    if (!currentUser || !selectedFriend) {
        setMessages([]);
        return;
    }

    const getMessageKey = (id1: number, id2: number) => {
        const sortedIds = [id1, id2].sort();
        return `messages-${sortedIds[0]}-${sortedIds[1]}`;
    }

    const messageKey = getMessageKey(currentUser.id, selectedFriend.id);
    const storedMessagesRaw = localStorage.getItem(messageKey);
    const loadedMessages = storedMessagesRaw ? JSON.parse(storedMessagesRaw) : [];
    setMessages(loadedMessages);

  }, [currentUser, selectedFriend]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedFriend) return;

    const message: Message = {
      senderId: currentUser.id,
      receiverId: selectedFriend.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    const getMessageKey = (id1: number, id2: number) => {
        const sortedIds = [id1, id2].sort();
        return `messages-${sortedIds[0]}-${sortedIds[1]}`;
    }

    try {
        const messageKey = getMessageKey(currentUser.id, selectedFriend.id);
        localStorage.setItem(messageKey, JSON.stringify(updatedMessages));
        setNewMessage('');
    } catch (error) {
        toast({ variant: 'destructive', title: 'Hata', description: 'Mesaj gönderilemedi.' });
        setMessages(messages); // Revert on error
    }
  };


  return (
    <div className="space-y-6">
       <div>
        <Button asChild variant="outline">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Profilime Geri Dön
          </Link>
        </Button>
      </div>

       <Card className="h-[75vh] flex overflow-hidden">
        {/* Left Panel: Friends List */}
        <div className={cn("w-full md:w-1/3 border-r transition-all duration-300", selectedFriend && "hidden md:block")}>
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold font-headline">Sohbetler</h2>
            </div>
            <ScrollArea className="h-full">
                {friends.length > 0 ? friends.map(friend => (
                    <div 
                        key={friend.id} 
                        className={cn(
                            "flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary",
                            selectedFriend?.id === friend.id && "bg-secondary"
                        )}
                        onClick={() => setSelectedFriend(friend)}
                    >
                        <Avatar>
                            <AvatarImage src={friend.photoUrl} alt={friend.name} />
                            <AvatarFallback>{getInitials(friend.name || friend.email)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{friend.name}</p>
                            <p className="text-xs text-muted-foreground">Sohbeti başlat...</p>
                        </div>
                    </div>
                )) : (
                    <div className="p-4 text-center text-muted-foreground">Hiç arkadaş bulunamadı.</div>
                )}
            </ScrollArea>
        </div>

        {/* Right Panel: Chat Window */}
        <div className={cn("w-full md:w-2/3 flex-col", selectedFriend ? "flex" : "hidden md:flex")}>
           {selectedFriend ? (
                <>
                    <div className="flex items-center gap-4 p-3 border-b bg-background">
                         <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedFriend(null)}>
                            <ArrowLeft />
                        </Button>
                        <Avatar>
                            <AvatarImage src={selectedFriend.photoUrl} alt={selectedFriend.name} />
                            <AvatarFallback>{getInitials(selectedFriend.name || selectedFriend.email)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold">{selectedFriend.name}</h3>
                    </div>
                    <ScrollArea className="flex-1 p-4 bg-secondary/50">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={cn("flex", msg.senderId === currentUser?.id ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-xs lg:max-w-md p-3 rounded-2xl",
                                        msg.senderId === currentUser?.id
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-background border rounded-bl-none"
                                    )}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className="text-xs text-right mt-1 opacity-70">
                                            {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                             <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-background">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <Input 
                                placeholder="Bir mesaj yaz..." 
                                autoComplete="off"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                <Send />
                                <span className="sr-only">Gönder</span>
                            </Button>
                        </form>
                    </div>
                </>
           ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <MessageSquare className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold">Sohbet Seç</h3>
                    <p className="text-muted-foreground">Sohbeti görüntülemek için sol taraftan bir arkadaşını seç.</p>
                </div>
           )}
        </div>
      </Card>
    </div>
  );
}


export default function MessagesPage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <MessagesPageComponent />
        </Suspense>
    )
}

    