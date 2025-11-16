'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, PlusCircle, Trash2, ImageIcon, Package, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export type PrintedProduct = {
    id: string;
    name: string;
    features: string;
    price: string;
    photoUrl?: string;
};

const STORAGE_KEY_PRODUCTS = 'printed-products';

export default function ProductsPage() {
    const { toast } = useToast();
    const [products, setProducts] = useState<PrintedProduct[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newProduct, setNewProduct] = useState<Omit<PrintedProduct, 'id'>>({
        name: '',
        features: '',
        price: '',
        photoUrl: '',
    });

    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
            if (storedProducts) setProducts(JSON.parse(storedProducts));
        } catch (error) {
            console.error("Ürünler yüklenemedi.", error);
        }
    }, []);

    const saveProductsToStorage = (updatedProducts: PrintedProduct[]) => {
        try {
            localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updatedProducts));
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata!', description: 'Ürünler kaydedilemedi.' });
        }
    };

    const handleSaveNewProduct = () => {
        if (!newProduct.name || !newProduct.price) {
            toast({ variant: 'destructive', title: 'Eksik Bilgi', description: 'Lütfen ürün adı ve fiyatı girin.' });
            return;
        }
        const finalProduct: PrintedProduct = { id: crypto.randomUUID(), ...newProduct };
        const updatedProducts = [...products, finalProduct];
        setProducts(updatedProducts);
        saveProductsToStorage(updatedProducts);
        
        toast({ title: 'Ürün Eklendi', description: `${finalProduct.name} başarıyla eklendi.` });
        
        // Reset form
        setIsAddingNew(false);
        setNewProduct({ name: '', features: '', price: '', photoUrl: '' });
    };

    const handleRemoveProduct = (id: string) => {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        saveProductsToStorage(updatedProducts);
        toast({ title: 'Ürün Silindi', description: 'Seçili ürün başarıyla silindi.' });
    };

    const handleNewProductChange = (field: keyof Omit<PrintedProduct, 'id'>, value: string) => {
        setNewProduct(prev => ({ ...prev, [field]: value }));
    };

    const handleNewPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleNewProductChange('photoUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold font-headline">Ürün Yönetimi</h1>
                    <p className="text-muted-foreground">Satılabilir basılı yıllık ürünlerini yönetin.</p>
                </div>
                 <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Yeni Ürün Ekle
                </Button>
            </div>

            {isAddingNew && (
                <Card className="animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle>Yeni Ürün Oluştur</CardTitle>
                        <CardDescription>Yeni basılı ürününüzün detaylarını girin.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-name" className="flex items-center gap-2"><Package className="w-4 h-4" /> Ürün Adı</Label>
                                    <Input id="new-name" value={newProduct.name} onChange={(e) => handleNewProductChange('name', e.target.value)} placeholder="Örn: Premium Sert Kapak Yıllık" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-features">Özellikler (her satıra bir özellik)</Label>
                                    <Textarea id="new-features" value={newProduct.features} onChange={(e) => handleNewProductChange('features', e.target.value)} placeholder="Sert kapak&#10;150gr kuşe kağıt&#10;Renkli baskı" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-price" className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Fiyat (TL)</Label>
                                    <Input id="new-price" type="number" value={newProduct.price} onChange={(e) => handleNewProductChange('price', e.target.value)} placeholder="750" className="max-w-xs" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Ürün Fotoğrafı</Label>
                                <label htmlFor="new-photo" className="w-full aspect-square bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed cursor-pointer relative overflow-hidden">
                                    {newProduct.photoUrl ? (
                                        <Image src={newProduct.photoUrl} alt={newProduct.name} layout="fill" objectFit="cover" />
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <ImageIcon className="mx-auto h-10 w-10" />
                                            <p className="text-xs mt-2">Görsel Yükle</p>
                                        </div>
                                    )}
                                </label>
                                <Input id="new-photo" type="file" accept="image/*" className="hidden" onChange={handleNewPhotoChange} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsAddingNew(false)}>İptal</Button>
                        <Button onClick={handleSaveNewProduct}>
                            <Save className="mr-2 h-4 w-4" />
                            Ürünü Kaydet
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Mevcut Ürünler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Görsel</TableHead>
                                    <TableHead>Ürün Adı</TableHead>
                                    <TableHead>Fiyat</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length > 0 ? products.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center overflow-hidden">
                                                {product.photoUrl ? <Image src={product.photoUrl} alt={product.name} width={48} height={48} objectFit="cover" /> : <Package className="w-6 h-6 text-muted-foreground"/> }
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.price} TL</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="icon" onClick={() => handleRemoveProduct(product.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Henüz ürün eklenmemiş.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
