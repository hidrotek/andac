
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Save, Eye, CalendarClock, UploadCloud, Loader2, Video } from 'lucide-react';
import { YearbookPageSettings } from './yearbook-page-settings';
import { FlipbookSettings, type FlipbookSettings as TFlipbookSettings } from './flipbook-settings';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { DesignSettings as PageDesignSettings } from './yearbook-live-preview';
import { Badge } from '../ui/badge';


type Cover = {
  type: 'image' | 'video';
  url: string;
};

type FullDesignSettings = {
  pageSettings: PageDesignSettings;
  flipbookSettings: TFlipbookSettings;
  deadline?: string;
  frontCovers?: Cover[];
  backCovers?: Cover[];
};

const initialSettings: FullDesignSettings = {
  pageSettings: {
    layout: 'classic-left',
    fontFamily: { name: 'poppins', quote: 'pt-sans' },
    fontSize: { name: '24', quote: '14' },
    color: { background: '#FFFFFF', text: '#333333', accent: '#2563EB' },
    photoFrame: 'rounded',
    backgroundImage: null,
  },
  flipbookSettings: {
    direction: 'ltr',
    flippingTime: 1000,
    showPageCorners: true,
    drawShadow: true,
    flipSound: '/sounds/classic.mp3', // Default sound
    appearance: {
      backgroundColor: '#f1f5f9',
      style: 'classic',
      spiralColor: '#888888',
    },
    controls: {
        singlePageMode: false,
    },
    automation: {
      autoPlay: false,
      flipInterval: 5000,
    },
  },
  deadline: undefined,
  frontCovers: [],
  backCovers: [],
};

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
        const errorData = await response.json().catch(() => ({ error: 'File upload failed' }));
        throw new Error(errorData.error);
    }

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error);
    }
    return { url: result.path }; // The API returns a relative path
};


function CoverUploadArea({ 
  title, 
  id,
  covers,
  onFileChange,
  onFileRemove,
}: { 
  title: string; 
  id: string;
  covers?: Cover[];
  onFileChange: (file: File | null) => Promise<void>;
  onFileRemove: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setIsLoading(true);
    setError(null);
    try {
      await onFileChange(file || null);
    } catch(err) {
       if (err instanceof Error) setError(err.message);
       else setError("Bilinmeyen bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
      setIsLoading(true);
      setError(null);
      await onFileRemove();
      const input = document.getElementById(id) as HTMLInputElement;
      if(input) input.value = "";
      setIsLoading(false);
  }

  const hasCovers = covers && covers.length > 0;
  const mainCover = hasCovers ? covers[0] : null;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base font-medium">
        {title}
      </Label>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg bg-secondary/50">
          <Loader2 className="w-10 h-10 mb-4 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Dosya işleniyor, lütfen bekleyin...</p>
        </div>
      ) : hasCovers && mainCover ? (
        <div className="relative w-full aspect-[210/297] border-2 border-dashed rounded-lg p-2 bg-secondary">
          {mainCover.type === 'video' ? (
            <video src={mainCover.url} autoPlay loop muted playsInline className="w-full h-full object-contain" />
          ) : (
             <Image src={mainCover.url} alt={title} layout="fill" objectFit="contain" />
          )}
           <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
            <Button variant="destructive" size="sm" onClick={handleRemove}>
              Kaldır
            </Button>
            {mainCover.type === 'video' && (
               <Badge variant="outline" className="self-end bg-background/80">
                <Video className='w-3 h-3 mr-1.5' /> Video
              </Badge>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={id}
            className={cn("flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary", error && "border-destructive")}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className={cn("w-10 h-10 mb-4 text-muted-foreground", error && "text-destructive")} />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Yüklemek için tıklayın</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Resim, GIF veya Video
              </p>
            </div>
             <Input id={id} type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      )}
       {error && <p className="text-sm text-destructive font-medium">{error}</p>}
    </div>
  );
}


export function YearbookDesign({
  scopeId,
  year,
}: {
  scopeId: string;
  year: string;
}) {
  const [settings, setSettings] = useState<FullDesignSettings>(initialSettings);
  const { toast } = useToast();
  const router = useRouter();

  const getStorageKey = useCallback((scope: string) => `yearbook-design-${scope}`, []);

  useEffect(() => {
    try {
      const storedSettingsRaw = localStorage.getItem(getStorageKey(scopeId));
      if (storedSettingsRaw) {
        const storedSettings = JSON.parse(storedSettingsRaw);
        setSettings(prev => ({ 
          ...initialSettings, 
          ...storedSettings,
          pageSettings: { ...initialSettings.pageSettings, ...(storedSettings.pageSettings || {}) },
          flipbookSettings: {
            ...initialSettings.flipbookSettings,
            ...(storedSettings.flipbookSettings || {}),
             appearance: { ...initialSettings.flipbookSettings.appearance, ...(storedSettings.flipbookSettings?.appearance || {}) },
            controls: { ...initialSettings.flipbookSettings.controls, ...(storedSettings.flipbookSettings?.controls || {}), },
            automation: { ...initialSettings.flipbookSettings.automation, ...(storedSettings.flipbookSettings?.automation || {}) }
          }
        }));
      } else {
        setSettings(initialSettings);
      }
    } catch (e) {
      console.error("Failed to load design settings from localStorage", e);
      setSettings(initialSettings);
    }
  }, [scopeId, getStorageKey]);
  
  const handleSave = () => {
    try {
      localStorage.setItem(getStorageKey(scopeId), JSON.stringify(settings));
      toast({
        title: 'Ayarlar Kaydedildi!',
        description: 'Yıllık tasarım ayarlarınız başarıyla kaydedildi.',
      });
    } catch (e) {
      console.error("Failed to save design settings to localStorage", e);
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Ayarlar kaydedilemedi.',
      });
    }
  };

  const handlePreview = () => {
    handleSave();
    router.push(`/yearbook/preview/${scopeId}`);
  };

  const handleDeadlineChange = (date: Date | undefined) => {
    setSettings(prev => ({...prev, deadline: date?.toISOString()}));
  };
  

  const handleFileChange = async (coverType: 'front' | 'back', file: File | null) => {
      const coverKey = coverType === 'front' ? 'frontCovers' : 'backCovers';
      
      await handleFileRemove(coverType);

      if (!file) {
        return;
      }
      
      const fileType = file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : 'image');
      const { url } = await uploadFileToServer(file, `covers/${scopeId}/${coverType}`);
      const newCovers: Cover[] = [{ type: fileType, url }];
      
      setSettings(prev => ({ ...prev, [coverKey]: newCovers }));
  };

  const handleFileRemove = async (coverType: 'front' | 'back') => {
      const coverKey = coverType === 'front' ? 'frontCovers' : 'backCovers';
      // In a real server environment, you might want to send a request to delete the file from the server.
      // For this implementation, we'll just clear it from the state.
      setSettings(prev => ({ ...prev, [coverKey]: [] }));
  };

  const deadlineDate = settings.deadline ? new Date(settings.deadline) : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yıllık Tasarımı ve İçeriği</CardTitle>
        <CardDescription>
          Yıllık tasarımını adımları takip ederek tamamlayın. Her adımı kaydettikten
          sonra diğer adıma geçebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="covers" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="covers">Kapaklar</TabsTrigger>
            <TabsTrigger value="page-design">Sayfa Tasarımı</TabsTrigger>
            <TabsTrigger value="flipbook">Flipbook Ayarları</TabsTrigger>
            <TabsTrigger value="settings">Yayın Ayarları</TabsTrigger>
          </TabsList>

          <TabsContent value="covers">
            <div className="p-6 border rounded-lg space-y-8 bg-background">
              <h3 className="text-xl font-medium font-headline">
                Ön ve Arka Kapak Yüklemesi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CoverUploadArea 
                  title="Ön Kapak Ekle" 
                  id="front-cover-upload" 
                  covers={settings.frontCovers}
                  onFileChange={(file) => handleFileChange('front', file)}
                  onFileRemove={() => handleFileRemove('front')}
                />
                <CoverUploadArea 
                  title="Arka Kapak Ekle" 
                  id="back-cover-upload"
                  covers={settings.backCovers}
                  onFileChange={(file) => handleFileChange('back', file)}
                  onFileRemove={() => handleFileRemove('back')}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="page-design">
            <div className="p-6 border rounded-lg bg-background">
              <YearbookPageSettings 
                settings={settings.pageSettings}
                onSettingsChange={(newPageSettings) => setSettings(prev => ({...prev, pageSettings: newPageSettings}))}
              />
            </div>
          </TabsContent>
          <TabsContent value="flipbook">
            <div className="p-6 border rounded-lg bg-background">
              <FlipbookSettings 
                settings={settings.flipbookSettings}
                onSettingsChange={(newFlipbookSettings) => setSettings(prev => ({...prev, flipbookSettings: newFlipbookSettings}))}
              />
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="p-6 border rounded-lg bg-background">
              <h3 className="text-xl font-medium font-headline mb-4">
                Yayın ve Teslim Tarihi Ayarları
              </h3>
              <div className="space-y-4 max-w-sm">
                <div className="space-y-2">
                  <Label>Sayfa Düzenlemesi İçin Son Tarih</Label>
                  <p className="text-sm text-muted-foreground">
                    Öğrencilerin kendi yıllık sayfalarını düzenleyebilecekleri son tarihi belirleyin. Bu tarihten sonra sayfalar kilitlenir.
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          'w-[280px] justify-start text-left font-normal',
                          !deadlineDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarClock className="mr-2 h-4 w-4" />
                        {deadlineDate ? format(deadlineDate, 'PPP') : <span>Bir tarih seçin</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadlineDate}
                        onSelect={handleDeadlineChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Yıllığı Önizle
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Tüm Ayarları Kaydet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
