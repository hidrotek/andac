
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GraduationCap, Mail, Lock, Building, MessageSquare, Text, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const setupSchema = z.object({
  appName: z.string().min(3, { message: 'Uygulama adı en az 3 karakter olmalıdır.' }),
  appSlogan: z.string().optional(),
  whatsappNumber: z.string().optional(),
  adminEmail: z.string().email({ message: 'Geçersiz e-posta adresi.' }),
  adminPassword: z.string().min(8, { message: 'Şifre en az 8 karakter olmalıdır.' }),
});

type SetupFormValues = z.infer<typeof setupSchema>;

export default function SetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      appName: 'Dijital Andaç',
      appSlogan: 'Anılarınızı Dijitalde Ölümsüzleştirin',
      whatsappNumber: '',
      adminEmail: '',
      adminPassword: '',
    },
  });

  const onSubmit = async (data: SetupFormValues) => {
    if (!firestore) {
        toast({ variant: 'destructive', title: 'Hata!', description: 'Veritabanı bağlantısı kurulamadı.' });
        return;
    }
    
    // This is a placeholder for a server-side function that would create the user.
    // In a real app, you would call a Firebase Function here.
    console.log("Creating admin user with (this should be a server-side action):", {
        email: data.adminEmail,
        password: data.adminPassword
    });

    try {
      // Save app settings to a single document in a 'settings' collection
      const appSettings = {
        appName: data.appName,
        appSlogan: data.appSlogan,
        whatsappNumber: data.whatsappNumber,
      };
      await setDoc(doc(firestore, 'settings', 'app'), appSettings);

      // This is a placeholder. You CANNOT create users from the client-side with a password directly.
      // You also cannot set custom claims from the client.
      // This part is for SIMULATION only. A real implementation needs a server-side function.
      await setDoc(doc(firestore, 'users', 'admin_user_placeholder'), {
        email: data.adminEmail,
        role: 'admin',
        createdAt: new Date().toISOString()
      });

      // Mark setup as complete in Firestore
      await setDoc(doc(firestore, 'settings', 'setup'), { complete: true });
      
      // Also mark in localStorage for immediate client-side redirection
      localStorage.setItem('setup-complete', 'true');

      toast({
        title: 'Kurulum Başarılı!',
        description: 'Uygulama başarıyla kuruldu. Yönetici paneline yönlendiriliyorsunuz.',
      });

      router.push('/login');
    } catch (error) {
      console.error('Kurulum sırasında hata:', error);
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Kurulum sırasında bir veritabanı hatası oluştu. Lütfen tekrar deneyin.',
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-foreground tracking-tight">
          Dijital Andaç Kurulumu
        </h1>
      </div>

      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Uygulama Kurulum Sihirbazı</CardTitle>
          <CardDescription>
            Uygulamayı kullanmaya başlamak için lütfen temel ayarları ve yönetici bilgilerinizi girin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4 rounded-md border p-4">
                 <h3 className="text-lg font-medium">Genel Ayarlar</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="appName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><Building className="w-4 h-4"/> Uygulama Adı</FormLabel>
                            <FormControl>
                                <Input placeholder="Dijital Andaç" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="appSlogan"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><Text className="w-4 h-4"/> Uygulama Sloganı</FormLabel>
                            <FormControl>
                                <Input placeholder="Anılarınızı Dijitalde Ölümsüzleştirin" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>
                 <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><MessageSquare className="w-4 h-4"/> WhatsApp Destek Numarası (İsteğe bağlı)</FormLabel>
                        <FormControl>
                            <Input placeholder="905551234567" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              
              <div className="space-y-4 rounded-md border p-4">
                <h3 className="text-lg font-medium">Yönetici Hesabı Oluştur</h3>
                 <p className="text-xs text-muted-foreground">Not: Bu, normalde sunucu tarafında yapılması gereken bir işlemin simülasyonudur.</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="adminEmail"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><Mail className="w-4 h-4"/> Yönetici E-postası</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="admin@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="adminPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><Lock className="w-4 h-4"/> Yönetici Şifresi</FormLabel>
                            <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              </div>

              <Button type="submit" className="w-full font-bold" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? 'Kaydediliyor...' : 'Kurulumu Tamamla ve Başla'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
