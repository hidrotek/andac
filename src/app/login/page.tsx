
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { GraduationCap, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { FirebaseError } from 'firebase/app';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { auth } = useFirebase();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (!email || !password) {
       toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Lütfen e-posta ve şifrenizi girin.',
      });
      return;
    }

    setIsLoading(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idTokenResult = await userCredential.user.getIdTokenResult();
        
        toast({
            title: 'Giriş Başarılı!',
            description: 'Yönlendiriliyorsunuz...',
        });

        if (idTokenResult.claims.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/profile');
        }

    } catch (error) {
        let description = 'E-posta veya şifre yanlış. Lütfen bilgilerinizi kontrol edin.';
        if (error instanceof FirebaseError) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                description = 'Girdiğiniz e-posta veya şifre hatalı.';
            } else if (error.code === 'auth/too-many-requests') {
                description = 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.';
            }
        }
        console.error("Login failed:", error);
        toast({
            variant: 'destructive',
            title: 'Giriş Başarısız!',
            description: description,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-6 left-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </Button>
      </div>
      
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-foreground tracking-tight">
          Dijital Andaç
        </h1>
      </div>

      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Giriş Yap</CardTitle>
          <CardDescription>
            Lütfen e-posta ve şifrenizle giriş yapın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
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
            <div className="grid gap-2">
               <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Şifremi Unuttum?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  placeholder="********" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2 font-bold" disabled={isLoading}>
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <div className="relative flex py-2 items-center w-full">
                <div className="flex-grow border-t border-muted"></div>
                <span className="flex-shrink mx-4 text-xs text-muted-foreground">Hesabınız yok mu?</span>
                <div className="flex-grow border-t border-muted"></div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/register">
                Okul Davetiyle Kayıt Ol
              </Link>
            </Button>
        </CardFooter>
      </Card>
      
    </div>
  );
}
