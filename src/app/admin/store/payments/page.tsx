'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, CreditCard, Banknote, Building, AlertTriangle } from "lucide-react";
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

export type PaymentSettings = {
    creditCard: {
        iyzico: {
            enabled: boolean;
            apiKey: string;
            apiSecret: string;
            mode: 'sandbox' | 'live';
        },
        paytr: {
            enabled: boolean;
            merchantId: string;
            merchantKey: string;
            merchantSalt: string;
        },
         param: {
            enabled: boolean;
            clientCode: string;
            clientUsername: string;
            clientPassword: string;
        }
    };
    bankTransfer: {
        enabled: boolean;
        accountHolder: string;
        iban: string;
        bankName: string;
    }
}

const STORAGE_KEY_PAYMENT = 'payment-settings';
const initialPaymentSettings: PaymentSettings = {
    creditCard: {
        iyzico: { enabled: false, apiKey: '', apiSecret: '', mode: 'sandbox' },
        paytr: { enabled: false, merchantId: '', merchantKey: '', merchantSalt: '' },
        param: { enabled: false, clientCode: '', clientUsername: '', clientPassword: '' }
    },
    bankTransfer: { enabled: true, accountHolder: '', iban: '', bankName: '' }
};

export default function PaymentMethodsPage() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<PaymentSettings>(initialPaymentSettings);

    useEffect(() => {
        try {
            const storedPayment = localStorage.getItem(STORAGE_KEY_PAYMENT);
            if (storedPayment) {
                 const parsed = JSON.parse(storedPayment);
                 // Merge stored settings with initial settings to avoid missing keys on update
                 setSettings(prev => ({
                    ...prev,
                    ...parsed,
                    creditCard: { ...prev.creditCard, ...(parsed.creditCard || {}) },
                    bankTransfer: { ...prev.bankTransfer, ...(parsed.bankTransfer || {}) }
                 }));
            }
        } catch (error) {
            console.error("Ödeme ayarları yüklenemedi.", error);
        }
    }, []);

    const handleSave = () => {
        try {
            localStorage.setItem(STORAGE_KEY_PAYMENT, JSON.stringify(settings));
            toast({
                title: 'Ayarlar Kaydedildi',
                description: 'Ödeme yöntemi ayarları başarıyla güncellendi.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Hata!',
                description: 'Ayarlar kaydedilemedi.',
            });
        }
    };

    const handleCreditCardChange = (provider: 'iyzico' | 'paytr' | 'param', key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            creditCard: {
                ...prev.creditCard,
                [provider]: {
                    ...prev.creditCard[provider],
                    [key]: value
                }
            }
        }));
    };
    
    const handleBankTransferChange = (key: keyof PaymentSettings['bankTransfer'], value: any) => {
        setSettings(prev => ({
            ...prev,
            bankTransfer: {
                ...prev.bankTransfer,
                [key]: value
            }
        }));
    };

    const IntegrationAlert = () => (
        <Alert variant="destructive" className="mb-6 bg-amber-50 border-amber-200 text-amber-900">
            <AlertTriangle className="h-4 w-4 !text-amber-600" />
            <AlertTitle>Simülasyon Uyarısı</AlertTitle>
            <AlertDescription className="text-amber-800">
                Bu arayüz bir prototiptir. Buraya girilen API bilgileri şu anda sadece kaydedilmektedir. Gerçek ödeme işlemleri için sunucu taraflı (backend) entegrasyonun bir geliştirici tarafından yapılması gerekmektedir.
            </AlertDescription>
        </Alert>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold font-headline">Ödeme Yöntemleri</h1>
                <p className="text-muted-foreground mt-1">
                    Müşterilerinizin kullanabileceği ödeme seçeneklerini yönetin.
                </p>
            </div>
            
            <Tabs defaultValue="credit-card" className="w-full">
                 <div className="overflow-x-auto md:overflow-x-visible -mx-4 px-4">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                        <TabsTrigger value="credit-card" className="gap-2"><CreditCard/> Kredi Kartı</TabsTrigger>
                        <TabsTrigger value="bank-transfer" className="gap-2"><Banknote/> Havale/EFT</TabsTrigger>
                    </TabsList>
                 </div>
                <TabsContent value="credit-card" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sanal POS Entegrasyonları</CardTitle>
                            <CardDescription>
                                Popüler ödeme ağ geçitlerinden birini veya birkaçını etkinleştirin ve API bilgilerinizi girin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Tabs defaultValue="iyzico" className="w-full" orientation="vertical">
                                {/* Desktop Vertical Tabs */}
                                <TabsList className="hidden md:grid md:w-1/4">
                                    <TabsTrigger value="iyzico" className="w-full justify-start gap-2">
                                        <Image src="https://www.iyzico.com/assets/images/logo/logo-iyzico.svg" alt="Iyzico" width={60} height={20} />
                                    </TabsTrigger>
                                    <TabsTrigger value="paytr" className="w-full justify-start gap-2">
                                        <Image src="https://www.paytr.com/assets/images/paytr-logo.svg" alt="PayTR" width={60} height={20} />
                                    </TabsTrigger>
                                     <TabsTrigger value="param" className="w-full justify-start gap-2">
                                        <Image src="https://param.com.tr/images/param_logo.svg" alt="Param" width={60} height={20} />
                                    </TabsTrigger>
                                </TabsList>

                                {/* Mobile Horizontal Tabs */}
                                <div className="overflow-x-auto md:hidden -mx-4 px-4 mb-4">
                                    <TabsList className="inline-grid auto-cols-auto grid-flow-col">
                                        <TabsTrigger value="iyzico">Iyzico</TabsTrigger>
                                        <TabsTrigger value="paytr">PayTR</TabsTrigger>
                                        <TabsTrigger value="param">Param</TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="w-full md:w-3/4 md:pl-4">
                                    <TabsContent value="iyzico" className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l mt-4 md:mt-0">
                                        <IntegrationAlert />
                                        <div className="flex items-center space-x-2 mb-6">
                                            <Switch id="iyzico-enabled" checked={settings.creditCard.iyzico.enabled} onCheckedChange={(c) => handleCreditCardChange('iyzico', 'enabled', c)} />
                                            <Label htmlFor="iyzico-enabled">Iyzico ile Ödeme Almayı Etkinleştir</Label>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="iyzico-api-key">API Anahtarı (Api Key)</Label>
                                                <Input id="iyzico-api-key" value={settings.creditCard.iyzico.apiKey} onChange={(e) => handleCreditCardChange('iyzico', 'apiKey', e.target.value)} disabled={!settings.creditCard.iyzico.enabled}/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="iyzico-api-secret">Gizli Anahtar (Secret Key)</Label>
                                                <Input id="iyzico-api-secret" value={settings.creditCard.iyzico.apiSecret} onChange={(e) => handleCreditCardChange('iyzico', 'apiSecret', e.target.value)} disabled={!settings.creditCard.iyzico.enabled}/>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="paytr" className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l mt-4 md:mt-0">
                                        <IntegrationAlert />
                                        <div className="flex items-center space-x-2 mb-6">
                                            <Switch id="paytr-enabled" checked={settings.creditCard.paytr.enabled} onCheckedChange={(c) => handleCreditCardChange('paytr', 'enabled', c)} />
                                            <Label htmlFor="paytr-enabled">PayTR ile Ödeme Almayı Etkinleştir</Label>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="paytr-id">Mağaza ID (Merchant ID)</Label>
                                                <Input id="paytr-id" value={settings.creditCard.paytr.merchantId} onChange={(e) => handleCreditCardChange('paytr', 'merchantId', e.target.value)} disabled={!settings.creditCard.paytr.enabled}/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="paytr-key">Mağaza Anahtarı (Merchant Key)</Label>
                                                <Input id="paytr-key" value={settings.creditCard.paytr.merchantKey} onChange={(e) => handleCreditCardChange('paytr', 'merchantKey', e.target.value)} disabled={!settings.creditCard.paytr.enabled}/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="paytr-salt">Mağaza Salt (Merchant Salt)</Label>
                                                <Input id="paytr-salt" value={settings.creditCard.paytr.merchantSalt} onChange={(e) => handleCreditCardChange('paytr', 'merchantSalt', e.target.value)} disabled={!settings.creditCard.paytr.enabled}/>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="param" className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l mt-4 md:mt-0">
                                        <IntegrationAlert />
                                        <div className="flex items-center space-x-2 mb-6">
                                            <Switch id="param-enabled" checked={settings.creditCard.param.enabled} onCheckedChange={(c) => handleCreditCardChange('param', 'enabled', c)} />
                                            <Label htmlFor="param-enabled">Param ile Ödeme Almayı Etkinleştir</Label>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-sm text-muted-foreground">Param entegrasyonu için gerekli API bilgilerinizi buraya girin.</p>
                                            {/* Param için gerekli alanlar buraya eklenebilir */}
                                        </div>
                                    </TabsContent>
                                </div>
                             </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="bank-transfer" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Banka Havalesi / EFT Bilgileri</CardTitle>
                            <CardDescription>Havale ile ödeme alacaksanız bu seçeneği etkinleştirin ve hesap bilgilerinizi girin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <Switch id="bank-enabled" checked={settings.bankTransfer.enabled} onCheckedChange={(c) => handleBankTransferChange('enabled', c)} />
                                <Label htmlFor="bank-enabled">Banka Havalesi ile Ödeme Almayı Etkinleştir</Label>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bank-name" className="flex items-center gap-2"><Building className="w-4 h-4" /> Banka Adı</Label>
                                    <Input id="bank-name" placeholder="Örn: Garanti Bankası" value={settings.bankTransfer.bankName} onChange={(e) => handleBankTransferChange('bankName', e.target.value)} disabled={!settings.bankTransfer.enabled} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="account-holder">Hesap Sahibi</Label>
                                    <Input id="account-holder" placeholder="Ali Yılmaz" value={settings.bankTransfer.accountHolder} onChange={(e) => handleBankTransferChange('accountHolder', e.target.value)} disabled={!settings.bankTransfer.enabled}/>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="iban">IBAN</Label>
                                    <Input id="iban" placeholder="TR00 0000 0000 0000 0000 0000" value={settings.bankTransfer.iban} onChange={(e) => handleBankTransferChange('iban', e.target.value)} disabled={!settings.bankTransfer.enabled}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <div className="flex justify-end pt-4">
                <Button size="lg" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Tüm Ödeme Ayarlarını Kaydet
                </Button>
            </div>
        </div>
    );
}
