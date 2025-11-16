
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, PlusCircle, Trash2, UploadCloud, Image as ImageIcon, CreditCard, Banknote } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';

export type PrintedProduct = {
    id: string;
    name: string;
    features: string;
    price: string;
    photoUrl?: string;
};

export type PaymentSettings = {
    creditCard: {
        enabled: boolean;
        provider: 'iyzico' | 'paytr';
        apiKey: string;
        apiSecret: string;
    };
    bankTransfer: {
        enabled: boolean;
        accountHolder: string;
        iban: string;
        bankName: string;
    }
}

const STORAGE_KEY_PRODUCTS = 'printed-products';
const STORAGE_KEY_PAYMENT = 'payment-settings';

export function PrintSettings() {
    const { toast } = useToast();
    const [products, setProducts] = useState<PrintedProduct[]>([]);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
        creditCard: { enabled: true, provider: 'iyzico', apiKey: '', apiSecret: '' },
        bankTransfer: { enabled: true, accountHolder: '', iban: '', bankName: '' }
    });

    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
            if (storedProducts) setProducts(JSON.parse(storedProducts));

            const storedPayment = localStorage.getItem(STORAGE_KEY_PAYMENT);
            if(storedPayment) setPaymentSettings(JSON.parse(storedPayment));
        } catch (error) {
            console.error("Baskı ayarları yüklenemedi.", error);
        }
    }, []);

    const handleSave = () => {
        try {
            localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
            localStorage.setItem(STORAGE_KEY_PAYMENT, JSON.stringify(paymentSettings));
            toast({
                title: 'Ayarlar Kaydedildi',
                description: 'Baskı ve ödeme ayarları başarıyla güncellendi.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Hata!',
                description: 'Ayarlar kaydedilemedi.',
            });
        }
    };
    
    const handleAddProduct = () => {
        setProducts([...products, { id: crypto.randomUUID(), name: '', features: '', price: '' }]);
    };

    const handleRemoveProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const handleProductChange = (id: string, field: keyof PrintedProduct, value: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
    };
    
     const handlePhotoChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleProductChange(id, 'photoUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            {/* Basılı Ürün Yönetimi */}
            <Card>
                <CardHeader>
                    <CardTitle>Basılı Yıllık Ürünleri</CardTitle>
                    <CardDescription>Kullanıcıların sipariş edebileceği basılı yıllık seçeneklerini yönetin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {products.map((product, index) => (
                        <div key={product.id} className="p-4 border rounded-lg space-y-4 relative">
                            <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => handleRemoveProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <h4 className="font-semibold">Ürün #{index + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                     <div className="space-y-2">
                                        <Label htmlFor={`name-${product.id}`}>Ürün Adı</Label>
                                        <Input id={`name-${product.id}`} value={product.name} onChange={(e) => handleProductChange(product.id, 'name', e.target.value)} placeholder="Örn: Premium Sert Kapak Yıllık" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`features-${product.id}`}>Özellikler (her satıra bir özellik)</Label>
                                        <Textarea id={`features-${product.id}`} value={product.features} onChange={(e) => handleProductChange(product.id, 'features', e.target.value)} placeholder="Sert kapak&#10;150gr kuşe kağıt&#10;Renkli baskı" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`price-${product.id}`}>Fiyat (TL)</Label>
                                        <Input id={`price-${product.id}`} type="number" value={product.price} onChange={(e) => handleProductChange(product.id, 'price', e.target.value)} placeholder="750" className="max-w-xs" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ürün Fotoğrafı</Label>
                                    <label htmlFor={`photo-${product.id}`} className="w-full aspect-square bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed cursor-pointer relative overflow-hidden">
                                        {product.photoUrl ? (
                                            <Image src={product.photoUrl} alt={product.name} layout="fill" objectFit="cover" />
                                        ) : (
                                            <div className="text-center text-muted-foreground">
                                                <ImageIcon className="mx-auto h-10 w-10" />
                                                <p className="text-xs mt-2">Görsel Yükle</p>
                                            </div>
                                        )}
                                    </label>
                                    <Input id={`photo-${product.id}`} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(product.id, e)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" onClick={handleAddProduct}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Yeni Ürün Ekle
                    </Button>
                </CardContent>
            </Card>

            {/* Ödeme Yöntemleri */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CreditCard /> Kredi Kartı ile Ödeme</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Kredi kartı ayarları buraya eklenebilir */}
                        <p className="text-sm text-muted-foreground">İzico, PayTR gibi ödeme ağ geçidi entegrasyonu ayarları burada yer alacak.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Banknote /> Banka Havalesi / EFT</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bank-name">Banka Adı</Label>
                            <Input id="bank-name" placeholder="Örn: Garanti Bankası" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="account-holder">Hesap Sahibi</Label>
                            <Input id="account-holder" placeholder="Ali Yılmaz" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="iban">IBAN</Label>
                            <Input id="iban" placeholder="TR00 0000 0000 0000 0000 0000" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="flex justify-end pt-4">
                <Button size="lg" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Tüm Ayarları Kaydet
                </Button>
            </div>
        </div>
    );
}
