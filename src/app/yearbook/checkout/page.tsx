
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Banknote, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PrintedProduct } from '@/app/admin/store/products/page';
import type { PaymentSettings } from '@/app/admin/store/payments/page'; 
import Image from 'next/image';
import type { User } from '@/components/admin/user-management'; 

const STORAGE_KEY_ORDERS = 'orders';

// Define Order type
export type Order = {
    id: string;
    productId: string;
    productName: string;
    price: string;
    customerName: string;
    customerEmail?: string;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        zip: string;
    };
    paymentMethod: 'creditCard' | 'bankTransfer';
    orderDate: string;
    status: 'pending' | 'paid' | 'shipped';
    tracking?: {
        company: string;
        number: string;
    };
}

function CheckoutPageComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const productId = searchParams.get('productId');
    const { toast } = useToast();

    const [product, setProduct] = useState<PrintedProduct | null>(null);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'creditCard' | 'bankTransfer'>();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zip: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!productId) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Geçersiz ürün kimliği.' });
            router.push('/yearbook/order');
            return;
        }

        try {
            // Load Product
            const storedProducts = localStorage.getItem('printed-products');
            if (storedProducts) {
                const products: PrintedProduct[] = JSON.parse(storedProducts);
                const selectedProduct = products.find(p => p.id === productId);
                if (selectedProduct) {
                    setProduct(selectedProduct);
                } else {
                     toast({ variant: 'destructive', title: 'Hata', description: 'Seçilen ürün bulunamadı.' });
                     router.push('/yearbook/order');
                }
            }

            // Load Payment Settings
            const storedPayment = localStorage.getItem('payment-settings');
            if (storedPayment) {
                const settings: PaymentSettings = JSON.parse(storedPayment);
                setPaymentSettings(settings);
                // Set default payment method
                if (settings.creditCard.iyzico.enabled || settings.creditCard.paytr.enabled || settings.creditCard.param.enabled) {
                    setPaymentMethod('creditCard');
                } else if (settings.bankTransfer.enabled) {
                    setPaymentMethod('bankTransfer');
                }
            }
            
            // Load current user
            const loggedInEmail = localStorage.getItem('loggedInUserEmail');
            if (loggedInEmail) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('yearbook-users-')) {
                         const usersRaw = localStorage.getItem(key);
                         const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
                         const user = users.find(u => u.email.toLowerCase() === loggedInEmail.toLowerCase());
                         if (user) {
                            setCurrentUser(user);
                            setShippingInfo(prev => ({ ...prev, firstName: user.name?.split(' ')[0] || '', lastName: user.name?.split(' ').slice(1).join(' ') || '' }));
                            break;
                         }
                    }
                }
            }

        } catch (error) {
            console.error("Ödeme bilgileri yüklenemedi", error);
        } finally {
            setIsLoading(false);
        }
    }, [productId, router, toast]);

    const handleInputChange = (field: keyof typeof shippingInfo, value: string) => {
        setShippingInfo(prev => ({ ...prev, [field]: value }));
    };

    const handlePlaceOrder = () => {
        if (!product || !paymentMethod || !shippingInfo.firstName || !shippingInfo.address || !shippingInfo.city) {
            toast({ variant: 'destructive', title: 'Eksik Bilgi', description: 'Lütfen teslimat adresi ve ödeme yöntemi bilgilerini eksiksiz doldurun.' });
            return;
        }

        const newOrder: Order = {
            id: crypto.randomUUID(),
            productId: product.id,
            productName: product.name,
            price: product.price,
            customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            customerEmail: currentUser?.email,
            shippingAddress: shippingInfo,
            paymentMethod: paymentMethod,
            orderDate: new Date().toISOString(),
            status: 'pending',
        };

        try {
            const existingOrdersRaw = localStorage.getItem(STORAGE_KEY_ORDERS);
            const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
            localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify([newOrder, ...existingOrders]));

            toast({
                title: 'Siparişiniz Alındı!',
                description: `Seçtiğiniz ${product?.name} için siparişiniz başarıyla oluşturuldu.`
            });
            router.push('/profile');

        } catch (error) {
            console.error("Sipariş kaydedilirken hata oluştu", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Siparişiniz kaydedilemedi.' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return <p>Ürün bulunamadı.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
             <div>
                <Button asChild variant="outline">
                    <Link href="/yearbook/order">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Ürün Seçimine Geri Dön
                    </Link>
                </Button>
            </div>

             <div className="text-center">
                <h1 className="text-4xl font-bold font-headline">Siparişi Tamamla</h1>
                <p className="text-muted-foreground mt-2">
                    Son bir adım kaldı! Teslimat ve ödeme bilgilerini tamamla.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sipariş Özeti */}
                <div className="md:col-span-1 space-y-6">
                    <h2 className="text-xl font-semibold">Sipariş Özeti</h2>
                    <Card>
                        <CardHeader className="p-0">
                            <Image src={product.photoUrl || 'https://placehold.co/400x400'} alt={product.name} width={400} height={400} className="rounded-t-lg object-cover" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <h3 className="font-bold">{product.name}</h3>
                            <p className="text-2xl font-bold mt-2">{product.price} TL</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Teslimat ve Ödeme */}
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Teslimat Adresi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Ad</Label>
                                    <Input id="firstName" placeholder="Ali" value={shippingInfo.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Soyad</Label>
                                    <Input id="lastName" placeholder="Yılmaz" value={shippingInfo.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Adres</Label>
                                <Textarea id="address" placeholder="Mahalle, sokak, no, daire..." value={shippingInfo.address} onChange={(e) => handleInputChange('address', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Şehir</Label>
                                    <Input id="city" placeholder="Ankara" value={shippingInfo.city} onChange={(e) => handleInputChange('city', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">Posta Kodu</Label>
                                    <Input id="zip" placeholder="06100" value={shippingInfo.zip} onChange={(e) => handleInputChange('zip', e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Ödeme Yöntemi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup onValueChange={(val: 'creditCard' | 'bankTransfer') => setPaymentMethod(val)} value={paymentMethod}>
                                <div className="space-y-4">
                                    {(paymentSettings?.creditCard.iyzico.enabled || paymentSettings?.creditCard.paytr.enabled || paymentSettings?.creditCard.param.enabled) && (
                                    <Label htmlFor='payment-cc' className="flex items-center gap-4 p-4 border rounded-lg has-[:checked]:border-primary cursor-pointer">
                                        <RadioGroupItem value="creditCard" id="payment-cc" />
                                        <CreditCard />
                                        <span className="font-medium">Kredi Kartı ile Öde</span>
                                    </Label>
                                    )}
                                    {paymentSettings?.bankTransfer.enabled && (
                                    <Label htmlFor='payment-bank' className="flex items-center gap-4 p-4 border rounded-lg has-[:checked]:border-primary cursor-pointer">
                                        <RadioGroupItem value="bankTransfer" id="payment-bank" />
                                        <Banknote />
                                        <span className="font-medium">Banka Havalesi / EFT</span>
                                    </Label>
                                    )}
                                </div>
                            </RadioGroup>

                            {paymentMethod === 'bankTransfer' && paymentSettings?.bankTransfer.enabled && (
                                <div className="mt-6 p-4 bg-secondary rounded-lg">
                                    <h4 className="font-semibold mb-2">Banka Bilgileri</h4>
                                    <p className="text-sm">Banka Adı: {paymentSettings.bankTransfer.bankName}</p>
                                    <p className="text-sm">Hesap Sahibi: {paymentSettings.bankTransfer.accountHolder}</p>
                                    <p className="text-sm">IBAN: {paymentSettings.bankTransfer.iban}</p>
                                    <p className="text-xs text-muted-foreground mt-2">Lütfen açıklama kısmına sipariş numaranızı veya adınızı yazmayı unutmayın.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Button size="lg" className="w-full" onClick={handlePlaceOrder}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Siparişi Onayla ve Tamamla ({product.price} TL)
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <CheckoutPageComponent />
        </Suspense>
    );
}
