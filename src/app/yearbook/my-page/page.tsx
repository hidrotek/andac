
'use client';

import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  ArrowLeft,
  Save,
  Trash2,
  Camera,
  ImageIcon,
  Quote,
  BookText,
  Lock,
  Unlock,
  ShieldAlert,
  BookLock,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { User } from '@/components/admin/user-management';

type YearbookFormValues = {
  profilePhoto: FileList | null;
  galleryPhotos: FileList | null;
  quote: string;
  memories: string;
};

type CurrentUser = User & { scopeId?: string };

function PhotoPlaceholder({ mediaUrl }: { mediaUrl?: string }) {
    const isVideo = mediaUrl && (mediaUrl.startsWith('data:video') || mediaUrl.includes('.mp4') || mediaUrl.includes('.webm') || mediaUrl.startsWith('/uploads'));

    return (
        <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed overflow-hidden">
            {mediaUrl ? (
                isVideo ? (
                    <video src={mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                    <Image src={mediaUrl} alt="Galeri içeriği" width={300} height={200} className="w-full h-full object-cover" />
                )
            ) : (
                <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto h-8 w-8" />
                    <p className="text-xs mt-2">Fotoğraf Alanı</p>
                </div>
            )}
        </div>
    );
}

// This function now uploads to our local API endpoint
const uploadFileToServer = async (file: File, subfolder: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subfolder', subfolder);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'File upload failed with non-JSON response' }));
        throw new Error(errorData.error || 'Bilinmeyen bir dosya yükleme hatası oluştu.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Unknown upload error');
    }
    return { url: result.path }; // The API returns a relative path
};


export default function MyYearbookPage() {
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
    const [isClient, setIsClient] = useState(false);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [isAnimatingLock, setIsAnimatingLock] = useState(false);


    const form = useForm<YearbookFormValues>({
        defaultValues: {
            profilePhoto: null,
            galleryPhotos: null,
            quote: '',
            memories: '',
        }
    });
    
    const calculateTimeLeft = useCallback(() => {
        if (!deadline) return {};
        const difference = +new Date(deadline) - +new Date();
        let newTimeLeft = {};

        if (difference > 0) {
            newTimeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return newTimeLeft;
    }, [deadline]);


    const getPageDataStorageKey = useCallback((userId: string | number) => `yearbook-pagedata-${userId}`, []);

    const findAndSetCurrentUser = useCallback(() => {
        const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
        if (!loggedInUserEmail) return;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('yearbook-users-')) {
                try {
                    const users: User[] = JSON.parse(localStorage.getItem(key) || '[]');
                    const foundUser = users.find(user => user.email.toLowerCase() === loggedInUserEmail.toLowerCase());
                    if (foundUser) {
                        const scopeId = key.replace('yearbook-users-', '');
                        setCurrentUser({ ...foundUser, scopeId });
                        setIsLocked(foundUser.pageSubmitted);
                        
                        const designKey = `yearbook-design-${scopeId}`;
                        const designSettingsRaw = localStorage.getItem(designKey);
                        if (designSettingsRaw) {
                            const designSettings = JSON.parse(designSettingsRaw);
                            if (designSettings.deadline) {
                                setDeadline(new Date(designSettings.deadline));
                            }
                        }

                        const pageDataRaw = localStorage.getItem(getPageDataStorageKey(foundUser.id));
                        if(pageDataRaw) {
                            const pageData = JSON.parse(pageDataRaw);
                            form.reset({
                                quote: pageData.quote || '',
                                memories: pageData.memories || '',
                            });
                             setProfilePhotoPreview(pageData.profilePhotoUrl || foundUser.photoUrl || null);
                             setGalleryPreviews(pageData.galleryPhotoUrls || []);
                        } else {
                            setProfilePhotoPreview(foundUser.photoUrl || null);
                        }
                        
                        return;
                    }
                } catch (e) {
                    console.error("Error reading from local storage", e);
                }
            }
        }
    }, [getPageDataStorageKey, form]);

    useEffect(() => {
        setIsClient(true);
        findAndSetCurrentUser();
    }, [findAndSetCurrentUser]);

    useEffect(() => {
        if (!deadline) return;

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (Object.keys(newTimeLeft).length === 0) {
              setIsLocked(true); // Automatically lock if time is up
              clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline, calculateTimeLeft]);

    const isTimeUp = Object.keys(timeLeft).length === 0 && !!deadline;
    const canEdit = !isLocked && !isTimeUp;

    const savePageData = async (callback?: () => void) => {
        if (!currentUser) {
             toast({ variant: 'destructive', title: 'Hata', description: 'Kullanıcı bilgisi bulunamadı.' });
             return;
        }

        const data = form.getValues();

        try {
            let newProfilePhotoUrl = profilePhotoPreview;
            const profilePhotoFile = data.profilePhoto?.[0];
            if (profilePhotoFile) {
                const { url } = await uploadFileToServer(profilePhotoFile, `profile-photos/${currentUser.id}`);
                newProfilePhotoUrl = url;
                
                // Update user object in localStorage as well
                const userStorageKey = `yearbook-users-${currentUser.scopeId}`;
                const usersRaw = localStorage.getItem(userStorageKey);
                if (usersRaw) {
                    let users: User[] = JSON.parse(usersRaw);
                    const userIndex = users.findIndex(u => u.id === currentUser.id);
                    if (userIndex !== -1) {
                        users[userIndex].photoUrl = newProfilePhotoUrl;
                        localStorage.setItem(userStorageKey, JSON.stringify(users));
                    }
                }
            }
            
            let newGalleryPhotoUrls = [...galleryPreviews];
            const galleryPhotoFiles = data.galleryPhotos;
            if (galleryPhotoFiles && galleryPhotoFiles.length > 0) {
                 const uploadedUrls = await Promise.all(
                    Array.from(galleryPhotoFiles).map(file => uploadFileToServer(file, `gallery-photos/${currentUser.id}`))
                 );
                 newGalleryPhotoUrls = uploadedUrls.map(u => u.url);
            }

            const pageData = {
                quote: data.quote,
                memories: data.memories,
                profilePhotoUrl: newProfilePhotoUrl,
                galleryPhotoUrls: newGalleryPhotoUrls,
            };
            localStorage.setItem(getPageDataStorageKey(currentUser.id), JSON.stringify(pageData));

            if(callback) callback();
            else {
              toast({
                  title: "Başarıyla Kaydedildi!",
                  description: "Yıllık sayfanız için yaptığınız değişiklikler kaydedildi.",
              });
            }
        } catch(e) {
             console.error("Error saving page data:", e);
             const errorMessage = e instanceof Error ? e.message : "Bilinmeyen bir hata oluştu.";
             toast({ variant: 'destructive', title: 'Hata', description: `Değişiklikler kaydedilemedi: ${errorMessage}` });
             throw e; // re-throw to stop follow-up actions like locking
        }
    };

    const onSubmit: SubmitHandler<YearbookFormValues> = async () => {
        await savePageData();
    };

    const handleLockPage = () => {
        if (!currentUser || !currentUser.scopeId) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Kullanıcı bilgisi veya kapsamı bulunamadı. Lütfen tekrar giriş yapın.' });
            return;
        }
        
        setIsAnimatingLock(true);

        setTimeout(async () => {
          try {
            await savePageData();
            const storageKey = `yearbook-users-${currentUser.scopeId}`;
            const usersRaw = localStorage.getItem(storageKey);
            if (!usersRaw) throw new Error('Kullanıcı listesi bulunamadı.');

            let users: User[] = JSON.parse(usersRaw);
            const userIndex = users.findIndex(u => u.id === currentUser.id);

            if (userIndex === -1) throw new Error('Kullanıcı listede bulunamadı.');
            
            users[userIndex].pageSubmitted = true;
            localStorage.setItem(storageKey, JSON.stringify(users));
            
            window.dispatchEvent(new StorageEvent('storage', { key: storageKey }));
            
            setIsLocked(true); 
            
            toast({
                title: "Sayfa Kilitlendi!",
                description: "Yıllık sayfanız başarıyla kilitlendi. Değişiklik yapamazsınız.",
            });
          } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
              toast({ variant: 'destructive', title: 'Hata', description: `Sayfa kilitlenirken bir sorun oluştu: ${errorMessage}` });
          } finally {
              setIsAnimatingLock(false);
          }
        }, 1000); // give some time for save to process
    };
    
    const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            form.setValue('profilePhoto', event.target.files);
            setProfilePhotoPreview(URL.createObjectURL(file));
        }
    };
    
     const handleGalleryPhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            form.setValue('galleryPhotos', files);
            const urls = Array.from(files).map(file => URL.createObjectURL(file));
            setGalleryPreviews(urls);
        }
    };


  return (
    <>
    {isAnimatingLock && (
        <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center animate-in fade-in-0 duration-500">
            <div className="flex flex-col items-center gap-4 text-white animate-pulse">
                <BookLock className="w-24 h-24 text-white drop-shadow-lg animate-in zoom-in-50 duration-1000" />
                <p className="text-xl font-semibold">Sayfa Kilitleniyor...</p>
            </div>
        </div>
    )}
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Button asChild variant="outline">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Profilime Geri Dön
          </Link>
        </Button>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">
          Yıllık Sayfamı Düzenle
        </h1>
        <p className="text-muted-foreground mt-2">
          Bu sayfa, yıllıkta sana ayrılan kişisel alanındır. Fotoğraflarını ve
          yazılarını ekleyerek unutulmaz kıl.
        </p>
      </div>
      
       {!canEdit && isClient && (
         <Alert variant={isLocked ? "default" : "destructive"} className={cn(isLocked && "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200")}>
            <ShieldAlert className={cn("h-4 w-4", isLocked ? "text-blue-500" : "text-destructive")} />
            <AlertTitle>
                 {isLocked 
                ? "Sayfanız Kilitlendi ve Gönderildi!"
                : "Sayfa Düzenleme Süresi Doldu!"
                }
            </AlertTitle>
            <AlertDescription className={cn(isLocked && "text-blue-700 dark:text-blue-300")}>
                {isLocked 
                ? "Değişiklik yapmak için lütfen okul yöneticinizle iletişime geçin."
                : "Sayfa düzenleme süresi dolmuştur. Değişiklik için yöneticiyle iletişime geçin."
                }
            </AlertDescription>
        </Alert>
      )}


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profil Fotoğrafı */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera /> Yıllık Profil Fotoğrafı
              </CardTitle>
              <CardDescription>
                Yıllıkta isminin yanında görünecek olan ana profil fotoğrafın. GIF veya kısa videolar da ekleyebilirsin.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/50 flex-shrink-0">
                 <PhotoPlaceholder mediaUrl={profilePhotoPreview || undefined} />
              </div>
              <fieldset disabled={!canEdit} className="w-full space-y-2">
                <FormItem>
                    <FormLabel htmlFor="profile-photo" className="sr-only">Profil fotoğrafı yükle</FormLabel>
                    <FormControl>
                    <Input 
                        id="profile-photo" 
                        type="file" 
                        accept="image/*,video/mp4,video/webm"
                        onChange={handleProfilePhotoChange}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                 <p className="text-sm text-muted-foreground">Kareye yakın, yüksek çözünürlüklü bir dosya seçmen önerilir.</p>
              </fieldset>
            </CardContent>
          </Card>

          {/* Galeri Fotoğrafları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon /> Fotoğraf Galerim
              </CardTitle>
              <CardDescription>
                Okul hayatından en sevdiğin anları paylaş. En fazla 4 fotoğraf, GIF veya kısa video
                ekleyebilirsin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <PhotoPlaceholder key={i} mediaUrl={galleryPreviews[i]} />
                ))}
              </div>
              <fieldset disabled={!canEdit}>
                 <FormItem>
                    <FormLabel htmlFor="gallery-photos" className="sr-only">Galeri fotoğrafları yükle</FormLabel>
                    <FormControl>
                    <Input id="gallery-photos" type="file" multiple accept="image/*,video/mp4,video/webm" onChange={handleGalleryPhotosChange} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              </fieldset>
            </CardContent>
          </Card>

          {/* Yazılar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookText /> Yazılarım
              </CardTitle>
              <CardDescription>
                Seni anlatan bir alıntı ve unutamadığın anılarını bizimle paylaş.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <fieldset disabled={!canEdit}>
                   <FormField
                      control={form.control}
                      name="quote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="quote" className="flex items-center gap-2 text-lg font-medium"><Quote className="w-5 h-5" /> Mottosu / Alıntısı</FormLabel>
                          <FormControl>
                            <Input id="quote" placeholder='"Gelecek, hayallerinin güzelliğine inananlarındır."' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="memories"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                            <FormLabel htmlFor="memories" className="flex items-center gap-2 text-lg font-medium"><BookText className="w-5 h-5" /> Benim Anılarım</FormLabel>
                           <FormControl>
                             <Textarea
                                id="memories"
                                placeholder="Lise hayatım boyunca unutamadığım anlar, arkadaşlarıma notlar, gelecek hedeflerim..."
                                className="min-h-48"
                                {...field}
                             />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                </fieldset>
            </CardContent>
          </Card>
          
          {isClient && canEdit && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className='flex items-center gap-2 text-sm font-medium'>
                  {deadline ? (
                     <>
                        <p className='text-muted-foreground'>Kalan Süre:</p>
                        {isTimeUp ? (
                          <span className='text-red-600 font-bold'>SÜRE DOLDU</span>
                        ) : (
                          <span className='font-mono text-primary tracking-wider'>
                            {timeLeft.days}G {timeLeft.hours}S {timeLeft.minutes}D {timeLeft.seconds}s
                          </span>
                        )}
                     </>
                  ) : (
                    <span className='text-amber-600'>Son teslim tarihi belirlenmemiş.</span>
                  )}
                </div>

                <div className="flex gap-4 items-stretch">
                    <Button type="button" variant="destructive" onClick={() => form.reset()} disabled={!canEdit}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Temizle
                    </Button>
                    <Button type="submit" size="lg" disabled={!canEdit}>
                      <Save className="mr-2 h-4 w-4" />
                      Değişiklikleri Kaydet
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button
                            variant="outline"
                            size="lg"
                            disabled={!canEdit}
                         >
                            <Unlock className="mr-2 h-4 w-4" />
                            Sayfayı Kilitle ve Gönder
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Sayfayı Kilitlemek Üzere misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Bu işlem geri alınamaz. Sayfanızı kilitledikten sonra, içeriği tekrar düzenleyemezsiniz. Değişiklik yapmak isterseniz okul yöneticinizle iletişime geçmeniz gerekecektir. Emin misiniz?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLockPage} className="bg-blue-600 hover:bg-blue-700">Evet, Kilitle ve Gönder</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
          )}
        </form>
      </Form>
    </div>
    </>
  );
}
