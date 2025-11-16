
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, GraduationCap, Mail } from 'lucide-react';
import type { User } from '@/components/admin/user-management';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate checking email against all user lists in localStorage
    let isInvited = false;
    let isRegistered = false;
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('yearbook-users-')) {
                const users: User[] = JSON.parse(localStorage.getItem(key) || '[]');
                const foundUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
                if (foundUser) {
                    isInvited = true;
                    if (foundUser.registered) {
                        isRegistered = true;
                    }
                    break;
                }
            }
        }
    } catch (error) {
        console.error("Error reading from localStorage", error);
        toast({
            variant: 'destructive',
            title: 'Bir hata oluştu!',
            description: 'Lütfen daha sonra tekrar deneyin.',
        });
        setIsLoading(false);
        return;
    }


    setTimeout(() => {
        if (isInvited) {
            if(isRegistered) {
                 toast({
                    variant: 'destructive',
                    title: 'Zaten Kayıtlısınız',
                    description: 'Bu e-posta adresi ile zaten bir hesap oluşturulmuş. Lütfen giriş yapın.',
                });
                 router.push('/login');
            } else {
                toast({
                    title: 'Davetiniz Onaylandı!',
                    description: 'Profilinizi oluşturmak için yönlendiriliyorsunuz.',
                });
                // Store email to be used on the next page
                sessionStorage.setItem('registrationEmail', email);
                router.push('/register/create-profile');
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Davet Bulunamadı',
                description: 'Girdiğiniz e-posta adresi herhangi bir okulun davetli listesinde bulunamadı.',
            });
        }
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-6 left-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Giriş Sayfasına Dön
          </Link>
        </Button>
      </div>

       <div className="absolute top-6 right-6 flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-foreground tracking-tight">
          Dijital Andaç
        </h1>
      </div>

      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Okul Davetiyle Kayıt Ol</CardTitle>
          <CardDescription>
            Yönetici tarafından size gönderilen e-posta adresini girerek kayıt işlemine başlayın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckEmail} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="okul.mail@adresiniz.com"
                  required
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2 font-bold" disabled={isLoading}>
              {isLoading ? 'Kontrol Ediliyor...' : 'Devam Et'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
