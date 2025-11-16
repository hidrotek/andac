
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        toast({
            variant: 'destructive',
            title: 'Hata!',
            description: 'Lütfen e-posta adresinizi girin.',
        });
        return;
    }

    setIsLoading(true);

    // Simulate sending a reset code and checking if email exists
    setTimeout(() => {
      // In a real app, you'd check if the email exists in your database.
      // Here, we'll just assume it does and proceed.
      toast({
        title: 'Kod Gönderildi',
        description: 'E-posta adresiniz sistemde kayıtlıysa, şifre sıfırlama talimatları gönderilmiştir.',
      });

      // Store email to be used on the reset password page
      sessionStorage.setItem('resetPasswordEmail', email);
      router.push('/reset-password');
      setIsLoading(false);
    }, 1500);
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
          <CardTitle className="text-2xl font-headline">Şifreni Sıfırla</CardTitle>
          <CardDescription>
            Hesabınıza ait e-posta adresini girerek şifre sıfırlama kodunu talep edin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendCode} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@eposta.com"
                  required
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2 font-bold" disabled={isLoading}>
              {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Kodu Gönder'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
