
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, GraduationCap, Lock, KeyRound } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const passwordSchema = z
  .string()
  .min(8, { message: 'Şifre en az 8 karakter olmalıdır.' })
  .regex(/[a-z]/, { message: 'Şifre en az bir küçük harf içermelidir.' })
  .regex(/[A-Z]/, { message: 'Şifre en az bir büyük harf içermelidir.' })
  .regex(/[0-9]/, { message: 'Şifre en az bir rakam içermelidir.' });

const formSchema = z.object({
  code: z.string().min(6, { message: 'Kod 6 karakter olmalıdır.' }).max(6),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor.',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const resetEmail = sessionStorage.getItem('resetPasswordEmail');
    if (!resetEmail) {
      toast({
        variant: 'destructive',
        title: 'Geçersiz İşlem',
        description: 'Lütfen şifre sıfırlama işlemine baştan başlayın.',
      });
      router.push('/forgot-password');
    } else {
      setEmail(resetEmail);
    }
  }, [router, toast]);
  
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);
    
    // In a real app, you would verify the code and then update the password in the database.
    // For this simulation, we'll just show a success message.
    setTimeout(() => {
      console.log("Resetting password for", email, "with data", data);

      toast({
        title: 'Şifre Başarıyla Değiştirildi!',
        description: 'Yeni şifrenizle giriş yapabilirsiniz.',
      });
      
      // Clean up session storage
      sessionStorage.removeItem('resetPasswordEmail');

      router.push('/login');
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

      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Yeni Şifre Oluştur</CardTitle>
          <CardDescription>
            E-posta adresinize (<span className="font-medium text-primary">{email}</span>) gönderilen 6 haneli kodu ve yeni şifrenizi girin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sıfırlama Kodu</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="123456" {...field} className="pl-10 tracking-widest text-center" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              
               <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Yeni Şifre</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="********" {...field} className="pl-10" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                        <FormControl>
                             <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="********" {...field} className="pl-10" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>
               
              <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                 {isLoading ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
