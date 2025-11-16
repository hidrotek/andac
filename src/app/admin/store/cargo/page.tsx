
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, AlertTriangle, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type CargoSettings = {
    mng: {
        enabled: boolean;
        apiKey: string;
        apiSecret: string;
    };
    aras: {
        enabled: boolean;
        apiKey: string;
        apiSecret: string;
    };
    yurtici: {
        enabled: boolean;
        apiKey: string;
        apiSecret: string;
    };
    surat: {
        enabled: boolean;
        apiKey: string;
        apiSecret: string;
    }
}

const STORAGE_KEY_CARGO = 'cargo-settings';
const initialCargoSettings: CargoSettings = {
    mng: { enabled: false, apiKey: '', apiSecret: '' },
    aras: { enabled: false, apiKey: '', apiSecret: '' },
    yurtici: { enabled: false, apiKey: '', apiSecret: '' },
    surat: { enabled: false, apiKey: '', apiSecret: '' }
};

export default function CargoSettingsPage() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<CargoSettings>(initialCargoSettings);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem(STORAGE_KEY_CARGO);
            if (storedSettings) {
                 const parsed = JSON.parse(storedSettings);
                 setSettings(prev => ({
                    ...prev,
                    ...parsed,
                    mng: { ...prev.mng, ...(parsed.mng || {}) },
                    aras: { ...prev.aras, ...(parsed.aras || {}) },
                    yurtici: { ...prev.yurtici, ...(parsed.yurtici || {}) },
                    surat: { ...prev.surat, ...(parsed.surat || {}) },
                 }));
            }
        } catch (error) {
            console.error("Kargo ayarları yüklenemedi.", error);
        }
    }, []);

    const handleSave = () => {
        try {
            localStorage.setItem(STORAGE_KEY_CARGO, JSON.stringify(settings));
            toast({
                title: 'Ayarlar Kaydedildi',
                description: 'Kargo entegrasyon ayarları başarıyla güncellendi.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Hata!',
                description: 'Ayarlar kaydedilemedi.',
            });
        }
    };

    const handleSettingChange = (provider: keyof CargoSettings, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [provider]: {
                ...prev[provider],
                [key]: value
            }
        }));
    };
    
    const IntegrationAlert = () => (
        <Alert variant="destructive" className="mb-6 bg-amber-50 border-amber-200 text-amber-900">
            <AlertTriangle className="h-4 w-4 !text-amber-600" />
            <AlertTitle>Simülasyon Uyarısı</AlertTitle>
            <AlertDescription className="text-amber-800">
                Bu arayüz bir prototiptir. Buraya girilen API bilgileri şu anda sadece kaydedilmektedir ve kargo takip durumunu otomatik olarak **güncellemez**. Gerçek zamanlı kargo takibi için sunucu taraflı (backend) entegrasyonun bir geliştirici tarafından yapılması gerekmektedir.
            </AlertDescription>
        </Alert>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold font-headline flex items-center gap-3">
                    <Truck />
                    Kargo Entegrasyonları
                </h1>
                <p className="text-muted-foreground mt-1">
                    Kargo firmaları ile entegrasyon için gerekli API bilgilerini yönetin.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Kargo Firması Ayarları</CardTitle>
                    <CardDescription>
                        Çalıştığınız kargo firmalarını etkinleştirin ve API bilgilerinizi girin.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Tabs defaultValue="mng" className="w-full" orientation="vertical">
                        {/* Desktop Vertical Tabs */}
                        <TabsList className="hidden md:grid md:w-1/4">
                            <TabsTrigger value="mng" className="w-full justify-start gap-2">MNG Kargo</TabsTrigger>
                            <TabsTrigger value="aras" className="w-full justify-start gap-2">Aras Kargo</TabsTrigger>
                            <TabsTrigger value="yurtici" className="w-full justify-start gap-2">Yurtiçi Kargo</TabsTrigger>
                            <TabsTrigger value="surat" className="w-full justify-start gap-2">Sürat Kargo</TabsTrigger>
                        </TabsList>

                        {/* Mobile Horizontal Tabs */}
                        <div className="overflow-x-auto md:hidden -mx-4 px-4 mb-4">
                            <TabsList className="inline-grid auto-cols-auto grid-flow-col">
                                <TabsTrigger value="mng">MNG</TabsTrigger>
                                <TabsTrigger value="aras">Aras</TabsTrigger>
                                <TabsTrigger value="yurtici">Yurtiçi</TabsTrigger>
                                <TabsTrigger value="surat">Sürat</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="w-full md:w-3/4 md:pl-4">
                            <TabsContent value="mng" className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l mt-4 md:mt-0">
                                <IntegrationAlert />
                                <div className="flex items-center space-x-2 mb-6">
                                    <Switch id="mng-enabled" checked={settings.mng.enabled} onCheckedChange={(c) => handleSettingChange('mng', 'enabled', c)} />
                                    <Label htmlFor="mng-enabled">MNG Kargo Entegrasyonunu Etkinleştir</Label>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="mng-api-key">API Anahtarı</Label>
                                        <Input id="mng-api-key" value={settings.mng.apiKey} onChange={(e) => handleSettingChange('mng', 'apiKey', e.target.value)} disabled={!settings.mng.enabled}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mng-api-secret">API Şifresi</Label>
                                        <Input id="mng-api-secret" value={settings.mng.apiSecret} onChange={(e) => handleSettingChange('mng', 'apiSecret', e.target.value)} disabled={!settings.mng.enabled}/>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="aras" className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l mt-4 md:mt-0">
                                <IntegrationAlert />
                                <div className="flex items-center space-x-2 mb-6">
                                    <Switch id="aras-enabled" checked={settings.aras.enabled} onCheckedChange={(c) => handleSettingChange('aras', 'enabled', c)} />
                                    <Label htmlFor="aras-enabled">Aras Kargo Entegrasyonunu Etkinleştir</Label>
                                </div>
                                <div className="space-y-4">
                                   <div className="space-y-2">
                                        <Label htmlFor="aras-api-key">Kullanıcı Adı / API Anahtarı</Label>
                                        <Input id="aras-api-key" value={settings.aras.apiKey} onChange={(e) => handleSettingChange('aras', 'apiKey', e.target.value)} disabled={!settings.aras.enabled}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="aras-api-secret">Şifre / API Şifresi</Label>
                                        <Input id="aras-api-secret" value={settings.aras.apiSecret} onChange={(e) => handleSettingChange('aras', 'apiSecret', e.target.value)} disabled={!settings.aras.enabled}/>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="yurtici" className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l mt-4 md:mt-0">
                                <IntegrationAlert />
                                <div className="flex items-center space-x-2 mb-6">
                                    <Switch id="yurtici-enabled" checked={settings.yurtici.enabled} onCheckedChange={(c) => handleSettingChange('yurtici', 'enabled', c)} />
                                    <Label htmlFor="yurtici-enabled">Yurtiçi Kargo Entegrasyonunu Etkinleştir</Label>
                                </div>
                                 <div className="space-y-4">
                                   <div className="space-y-2">
                                        <Label htmlFor="yurtici-api-key">API Anahtarı</Label>
                                        <Input id="yurtici-api-key" value={settings.yurtici.apiKey} onChange={(e) => handleSettingChange('yurtici', 'apiKey', e.target.value)} disabled={!settings.yurtici.enabled}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="yurtici-api-secret">API Şifresi</Label>
                                        <Input id="yurtici-api-secret" value={settings.yurtici.apiSecret} onChange={(e) => handleSettingChange('yurtici', 'apiSecret', e.target.value)} disabled={!settings.yurtici.enabled}/>
                                    </div>
                                </div>
                            </TabsContent>
                              <TabsContent value="surat" className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l mt-4 md:mt-0">
                                <IntegrationAlert />
                                <div className="flex items-center space-x-2 mb-6">
                                    <Switch id="surat-enabled" checked={settings.surat.enabled} onCheckedChange={(c) => handleSettingChange('surat', 'enabled', c)} />
                                    <Label htmlFor="surat-enabled">Sürat Kargo Entegrasyonunu Etkinleştir</Label>
                                </div>
                                 <div className="space-y-4">
                                   <div className="space-y-2">
                                        <Label htmlFor="surat-api-key">Kullanıcı Adı</Label>
                                        <Input id="surat-api-key" value={settings.surat.apiKey} onChange={(e) => handleSettingChange('surat', 'apiKey', e.target.value)} disabled={!settings.surat.enabled}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="surat-api-secret">Şifre</Label>
                                        <Input id="surat-api-secret" value={settings.surat.apiSecret} onChange={(e) => handleSettingChange('surat', 'apiSecret', e.target.value)} disabled={!settings.surat.enabled}/>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                     </Tabs>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button size="lg" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Kargo Ayarlarını Kaydet
                </Button>
            </div>
        </div>
    );
}
