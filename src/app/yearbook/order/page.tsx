
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { PrintedProduct } from '@/app/admin/store/products/page';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function OrderPage() {
    const [products, setProducts] = useState<PrintedProduct[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem('printed-products');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            }
        } catch (error) {
            console.error("Ürünler yüklenemedi.", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Ürünler yüklenirken bir sorun oluştu.' });
        }
    }, [toast]);
    
    const handleProceedToCheckout = () => {
        if (!selectedProductId) {
            toast({ variant: 'destructive', title: 'Ürün Seçmediniz', description: 'Lütfen devam etmeden önce bir yıllık seçin.' });
            return;
        }
        router.push(`/yearbook/checkout?productId=${selectedProductId}`);
    };

    return (
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
                <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
                    <Printer />
                    Basılı Andaç Siparişi
                </h1>
                <p className="text-muted-foreground mt-2">
                    Anılarını ölümsüzleştir! Aşağıdaki seçeneklerden birini seçerek basılı yıllığını sipariş et.
                </p>
            </div>
            
            {products.length === 0 ? (
                <Card className="text-center p-8">
                    <CardTitle>Henüz Ürün Yok</CardTitle>
                    <CardDescription className="mt-2">Yönetici tarafından henüz satılabilir bir basılı ürün eklenmemiş.</CardDescription>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <Card 
                            key={product.id} 
                            onClick={() => setSelectedProductId(product.id)}
                            className={cn(
                                "cursor-pointer transition-all hover:shadow-lg hover:border-primary",
                                selectedProductId === product.id && "border-2 border-primary shadow-xl"
                            )}
                        >
                            <CardHeader className="p-0">
                                <div className="relative w-full aspect-square">
                                    <Image src={product.photoUrl || 'https://placehold.co/400x400'} alt={product.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                                     {selectedProductId === product.id && (
                                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                     <CardTitle>{product.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                                    {product.features.split('\n').map((feature, i) => (
                                        feature && <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                             <CardFooter className="flex-col items-stretch">
                                <p className="text-2xl font-bold text-center mb-4">{product.price} TL</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            
            {products.length > 0 && (
                 <div className="flex justify-center pt-8">
                    <Button size="lg" onClick={handleProceedToCheckout} disabled={!selectedProductId}>
                        Satın Al ve Devam Et
                    </Button>
                </div>
            )}
        </div>
    );
}
