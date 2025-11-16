
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { ArrowLeft, GraduationCap, User as UserIcon, Lock, Eye, EyeOff, UploadCloud, Phone } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { User } from '@/components/admin/user-management';

const passwordSchema = z
  .string()
  .min(8, { message: 'Şifre en az 8 karakter olmalıdır.' })
  .regex(/[a-z]/, { message: 'Şifre en az bir küçük harf içermelidir.' })
  .regex(/[A-Z]/, { message: 'Şifre en az bir büyük harf içermelidir.' })
  .regex(/[0-9]/, { message: 'Şifre en az bir rakam içermelidir.' });

const formSchema = z.object({
  name: z.string().min(3, { message: 'İsim en az 3 karakter olmalıdır.' }),
  phone: z.string().optional(),
  password: passwordSchema,
  confirmPassword: z.string(),
  profilePhoto: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor.',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const registrationEmail = sessionStorage.getItem('registrationEmail');
    if (!registrationEmail) {
      toast({
        variant: 'destructive',
        title: 'Geçersiz İşlem',
        description: 'Lütfen kayıt işlemine e-posta doğrulama adımından başlayın.',
      });
      router.push('/register');
    } else {
      setEmail(registrationEmail);
    }
  }, [router, toast]);
  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    if (!email) return;

    let photoUrl = `https://picsum.photos/seed/${Date.now()}/200`; // Default stock image
    const photoFile = data.profilePhoto?.[0];

    if (photoFile) {
        // In a real app, you'd upload this file to a storage service (e.g., Firebase Storage)
        // and get a URL. Here, we'll simulate it using a blob URL.
        photoUrl = URL.createObjectURL(photoFile);
    }
    
    try {
      let userFoundAndUpdated = false;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('yearbook-users-')) {
          let users: User[] = JSON.parse(localStorage.getItem(key) || '[]');
          const userIndex = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
          
          if (userIndex !== -1) {
            users[userIndex] = { 
              ...users[userIndex], 
              name: data.name, 
              phone: data.phone,
              photoUrl: photoUrl,
              password: data.password, // Save the password
              registered: true 
            };
            localStorage.setItem(key, JSON.stringify(users));
            userFoundAndUpdated = true;
            break; 
          }
        }
      }

      if (!userFoundAndUpdated) {
        throw new Error("Davet edilen kullanıcı localStorage listelerinin hiçbirinde bulunamadı.");
      }

      localStorage.setItem('loggedInUserEmail', email);

      sessionStorage.removeItem('registrationEmail');

      toast({
        title: 'Hesabınız Oluşturuldu!',
        description: 'Giriş başarılı. Profilinize yönlendiriliyorsunuz.',
      });
      
      setTimeout(() => {
          router.push('/profile');
      }, 1000);

    } catch(error) {
         console.error("Kullanıcı güncellenirken hata:", error);
         toast({ variant: 'destructive', title: 'Kayıt Başarısız!', description: 'Kullanıcı verisi güncellenemedi.' });
         setIsLoading(false);
    }
  };


  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4 relative">
        <div className="absolute top-6 left-6">
            <Button asChild variant="outline" size="sm">
            <Link href="/register">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri Dön
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
          <CardTitle className="text-2xl font-headline">Profilini Oluştur</CardTitle>
          <CardDescription>
            E-posta adresiniz: <span className="font-medium text-primary">{email}</span>.
            Lütfen aşağıdaki bilgileri doldurarak kaydınızı tamamlayın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>İsim Soyisim</FormLabel>
                          <FormControl>
                              <div className="relative">
                                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="Adınız Soyadınız" {...field} className="pl-10" />
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Telefon Numarası (İsteğe Bağlı)</FormLabel>
                          <FormControl>
                              <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input type="tel" placeholder="555 123 4567" {...field} className="pl-10" />
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                </div>

                <FormField
                    control={form.control}
                    name="profilePhoto"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Profil Fotoğrafı (İsteğe Bağlı)</FormLabel>
                        <FormControl>
                             <label htmlFor="profile-photo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Yüklemek için tıklayın</span></p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG</p>
                                </div>
                                <Input id="profile-photo" type="file" accept="image/png, image/jpeg" className="hidden" onChange={(e) => field.onChange(e.target.files)} />
                            </label>
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
                        <FormLabel>Şifre</FormLabel>
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
                        <FormLabel>Şifre Tekrar</FormLabel>
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
                 {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol ve Giriş Yap'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
