
'use client';

import Link from 'next/link';
import { User as UserIcon, GraduationCap, LogOut, Edit, BookOpen, Users, Instagram, Twitter, Facebook, Linkedin, Phone, MessageSquare, Printer, ShoppingCart, Truck, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import type { User } from '@/components/admin/user-management';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/app/yearbook/checkout/page';

// Okul adlarını simüle eden bir harita
const schoolIdToNameMap: { [key: string]: string } = {
  '1': 'Gazi Anadolu Lisesi',
  '2': 'Cumhuriyet Fen Lisesi',
};

// scopeId'yi de içeren genişletilmiş kullanıcı state tipi
type CurrentUser = User & { scopeId?: string };
type Message = { senderId: number };

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

function OrderStatusIcon({ status }: { status: Order['status'] }) {
    switch (status) {
        case 'pending':
             return <ShoppingCart className="h-5 w-5 text-gray-500" />;
        case 'paid':
            return <Package className="h-5 w-5 text-blue-500" />;
        case 'shipped':
            return <Truck className="h-5 w-5 text-amber-500" />;
        default:
            return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
}

function OrderStatusText({ status }: { status: Order['status'] }) {
     switch (status) {
        case 'pending': return "Ödeme Bekleniyor";
        case 'paid': return "Sipariş Hazırlanıyor";
        case 'shipped': return "Kargoya Verildi";
        default: return "Bilinmeyen Durum";
    }
}


export default function ProfilePage() {
  const completionPercentage = 60;
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
      return;
    }

    let userFound = false;
    let foundUserObject: CurrentUser | null = null;
    // Tüm localStorage anahtarlarını tara
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('yearbook-users-')) {
        try {
          const users: User[] = JSON.parse(localStorage.getItem(key) || '[]');
          const foundUser = users.find(user => user.email.toLowerCase() === loggedInUserEmail.toLowerCase());
          
          if (foundUser) {
             const scopeId = key.replace('yearbook-users-', '');
             foundUserObject = { ...foundUser, scopeId };
             setCurrentUser(foundUserObject); 
             userFound = true;
             break;
          }
        } catch (error) {
          console.error(`Error parsing localStorage key ${key}:`, error);
        }
      }
    }

     if (foundUserObject) {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('messages-')) {
          const ids = key.split('-').slice(1).map(Number);
          if (ids.includes(foundUserObject.id)) {
            const messagesRaw = localStorage.getItem(key);
            if (messagesRaw) {
              const messages: Message[] = JSON.parse(messagesRaw);
              if (messages.length > 0 && messages[messages.length - 1].senderId !== foundUserObject.id) {
                count++;
              }
            }
          }
        }
      }
      setUnreadCount(count);

      // Load orders
      const ordersRaw = localStorage.getItem('orders');
      if (ordersRaw) {
          const allOrders: Order[] = JSON.parse(ordersRaw);
          const currentUserOrders = allOrders.filter(order => order.customerEmail?.toLowerCase() === loggedInUserEmail.toLowerCase());
          setUserOrders(currentUserOrders);
      }
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };
  
  const schoolName = currentUser ? schoolIdToNameMap[currentUser.schoolId] || `Okul ID: ${currentUser.schoolId}` : 'Okul Bilgisi Yükleniyor...';
  const className = currentUser?.classId ? ` - ${currentUser.classId.toUpperCase().replace('-', ' ')}` : '';

  const openTrackingUrl = (order: Order) => {
      if(!order.tracking) return;
      // Bu URL'ler sadece bir simülasyondur. Gerçek entegrasyonda doğru URL'ler kullanılmalıdır.
      const trackingUrls: {[key: string]: string} = {
          'mng': `https://www.mngkargo.com.tr/gonderitakip?q=${order.tracking.number}`,
          'aras': `https://araskargo.com.tr/tr/index.php?p=teslimat_kargo_takip&kodu=${order.tracking.number}`,
          'yurtiçi': `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${order.tracking.number}`,
      }
      const companyKey = order.tracking.company.toLowerCase();
      const url = trackingUrls[companyKey] || `https://www.google.com/search?q=${order.tracking.company}+kargo+takip+${order.tracking.number}`;
      window.open(url, '_blank');
  }


  return (
    <div className="w-full min-h-screen bg-secondary">
      {/* Desktop Header */}
      <header className="bg-background border-b hidden md:block">
        <div className="container h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
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

      {/* Mobile Header */}
      <header className='p-4 bg-background border-b md:hidden flex items-center justify-between'>
        <h1 className="text-xl font-headline font-bold">Hoş Geldin, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Öğrenci'}!</h1>
         <Button variant="ghost" size="sm" asChild>
            <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
            </Link>
        </Button>
      </header>

      <main className="py-6 md:py-10 pb-24 md:pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sol Taraf: Profil ve Yıllık Durumu */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader className="flex-row items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={currentUser?.photoUrl} alt={currentUser?.name || 'Öğrenci'} data-ai-hint="person student" />
                                    <AvatarFallback>{currentUser ? getInitials(currentUser.name || currentUser.email) : '...'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl font-headline">{currentUser?.name || 'İsim Yükleniyor...'}</CardTitle>
                                    <CardDescription>{schoolName}{className}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p><strong>Okul No:</strong> {currentUser?.id || '...'}</p>
                                    <p><strong>E-posta:</strong> {currentUser?.email || '...'}</p>
                                    <p><strong>Telefon:</strong> {currentUser?.phone || 'Eklenmemiş'}</p>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Sosyal Medya Hesapları</CardTitle>
                                <CardDescription>Profilinde görünmesini istediğin sosyal medya hesaplarını ekle.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="instagram" placeholder="Instagram kullanıcı adın" className="pl-10" />
                                </div>
                                <div className="relative">
                                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="twitter" placeholder="Twitter (X) kullanıcı adın" className="pl-10" />
                                </div>
                                <div className="relative">
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="linkedin" placeholder="LinkedIn profil linkin" className="pl-10" />
                                </div>
                            </CardContent>
                            <CardFooter>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Düzenle
                            </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Yıllık Sayfanızın Durumu</CardTitle>
                                <CardDescription>Sayfanızı tamamlamak için gereken adımları takip edin.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Progress value={completionPercentage} className="w-full" />
                                        <span className="font-bold text-lg text-primary">{completionPercentage}%</span>
                                    </div>
                                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                        <li className="text-green-600">Profil fotoğrafı yüklendi</li>
                                        <li>Galeri fotoğrafları eksik</li>
                                        <li className="text-green-600">Alıntı eklendi</li>
                                        <li>Anı yazısı eksik</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sağ Taraf: Aksiyonlar */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-4 md:p-6 hidden md:block">
                            <CardHeader>
                                <CardTitle className="text-3xl font-headline">Hoş Geldin, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Öğrenci'}!</CardTitle>
                                <CardDescription>Yıllığını oluşturmaya ve arkadaşlarınla anılarını paylaşmaya başla.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <ActionCard
                                    icon={<Edit className="w-10 h-10 text-primary" />}
                                    title="Yıllık Sayfamı Düzenle"
                                    description="Profil fotoğrafını, galerini, alıntını ve anı yazını düzenle."
                                    href="/yearbook/my-page"
                                />
                                <ActionCard
                                    icon={<MessageSquare className="w-10 h-10 text-primary" />}
                                    title="Mesajlarım"
                                    description="Arkadaşlarınla sohbet et ve anılarını paylaş."
                                    href={`/yearbook/messages?scopeId=${currentUser?.scopeId || ''}`}
                                />
                                <ActionCard
                                    icon={<BookOpen className="w-10 h-10 text-primary" />}
                                    title="Yıllığı Görüntüle"
                                    description="Tüm anıların bir araya geldiği dijital yıllığına göz at."
                                    href={`/yearbook/preview/${currentUser?.scopeId || ''}`}
                                />
                                <ActionCard
                                    icon={<Printer className="w-10 h-10 text-primary" />}
                                    title="Basılı Andaç Sipariş Et"
                                    description="Anılarını elle tutulur hale getir. Farklı seçeneklerle baskılı yıllığını sipariş et."
                                    href="/yearbook/order"
                                />
                            </CardContent>
                        </Card>
                         {userOrders.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Siparişlerim</CardTitle>
                                    <CardDescription>Geçmiş ve mevcut basılı yıllık siparişlerin.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {userOrders.map(order => (
                                        <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-background gap-4">
                                            <div className="flex items-center gap-4">
                                                <OrderStatusIcon status={order.status} />
                                                <div>
                                                    <p className="font-semibold">{order.productName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Sipariş Tarihi: {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full sm:w-auto">
                                                <Badge variant={order.status === 'shipped' ? 'default' : 'outline'} className="self-start sm:self-center">
                                                    <OrderStatusText status={order.status} />
                                                </Badge>
                                                {order.tracking?.number && (
                                                    <Button size="sm" variant="secondary" onClick={() => openTrackingUrl(order)}>
                                                        <Truck className="mr-2 h-4 w-4" />
                                                        Kargo Takip
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 md:hidden">
          <div className="grid grid-cols-4 gap-2">
            <MobileAction icon={<UserIcon />} title="Profilim" href="/profile" isActive={true}/>
            <MobileAction icon={<Edit />} title="Sayfam" href="/yearbook/my-page"/>
            <MobileAction icon={<MessageSquare />} title="Mesajlar" href={`/yearbook/messages?scopeId=${currentUser?.scopeId || ''}`} badgeCount={unreadCount} />
            <MobileAction icon={<Printer />} title="Sipariş" href="/yearbook/order"/>
          </div>
      </footer>
    </div>
  );
}

function ActionCard({ title, description, icon, href }: { title: string; description:string; icon: React.ReactNode; href: string; }) {
    return (
        <Link href={href} className="block group">
            <Card className="h-full hover:border-primary hover:shadow-lg transition-all duration-300">
                <CardHeader>
                    {icon}
                    <CardTitle className="font-headline mt-4">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{description}</p>
                </CardContent>
            </Card>
        </Link>
    )
}
    

    




