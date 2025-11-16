"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, UploadCloud, MessageSquare } from "lucide-react";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function AppSettings() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [appName, setAppName] = useState('Dijital Andaç');
  const [appSlogan, setAppSlogan] = useState('Anılarınızı Dijitalde Ölümsüzleştirin');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    if (!firestore) return;
    const fetchSettings = async () => {
        const settingsDoc = await getDoc(doc(firestore, 'settings', 'app'));
        if (settingsDoc.exists()) {
            const settings = settingsDoc.data();
            setAppName(settings.appName || 'Dijital Andaç');
            setAppSlogan(settings.appSlogan || 'Anılarınızı Dijitalde Ölümsüzleştirin');
            setWhatsappNumber(settings.whatsappNumber || '');
        }
    };
    fetchSettings();
  }, [firestore]);

  const handleSave = async () => {
    if (!firestore) return;
    try {
        const settings = {
            appName,
            appSlogan,
            whatsappNumber,
        };
        await setDoc(doc(firestore, 'settings', 'app'), settings, { merge: true });
        toast({
            title: 'Ayarlar Kaydedildi',
            description: 'Uygulama ayarları başarıyla güncellendi.',
        });
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Hata!',
            description: 'Ayarlar kaydedilemedi.',
        });
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
        <div className="space-y-2">
            <Label htmlFor="app-name">Uygulama Adı</Label>
            <Input id="app-name" value={appName} onChange={(e) => setAppName(e.target.value)} className="max-w-xs" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="app-slogan">Uygulama Sloganı</Label>
            <Input id="app-slogan" value={appSlogan} onChange={(e) => setAppSlogan(e.target.value)} className="max-w-xs" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="whatsapp-number" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                WhatsApp Destek Numarası
            </Label>
            <Input id="whatsapp-number" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="905551234567" className="max-w-xs" />
            <p className="text-xs text-muted-foreground">Uluslararası formatta, boşluk olmadan girin (Örn: 905551234567).</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <Label htmlFor="app-logo-light">Uygulama Logosu (Açık Tema)</Label>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 bg-secondary rounded-md flex items-center justify-center border relative">
                        <Image src="/logo-placeholder.svg" alt="logo" fill style={{ objectFit: 'contain', padding: '8px' }}/>
                    </div>
                    <div className="w-full">
                        <Input id="app-logo-light" type="file" />
                        <p className="text-xs text-muted-foreground mt-2">Beyaz veya açık arkaplanlar için.</p>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="app-logo-dark">Uygulama Logosu (Koyu Tema)</Label>
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700 relative">
                        <Image src="/logo-placeholder-dark.svg" alt="logo dark" fill style={{ objectFit: 'contain', padding: '8px' }}/>
                    </div>
                    <div className="w-full">
                        <Input id="app-logo-dark" type="file" />
                        <p className="text-xs text-muted-foreground mt-2">Siyah veya koyu arkaplanlar için.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="flex justify-start pt-4">
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Değişiklikleri Kaydet
            </Button>
        </div>
    </div>
  );
}
