
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilePen, Truck, Package, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/app/yearbook/checkout/page';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STORAGE_KEY_ORDERS = 'orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({ company: '', number: '' });

  useEffect(() => {
    try {
      const storedOrdersRaw = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (storedOrdersRaw) {
        setOrders(JSON.parse(storedOrdersRaw));
      }
    } catch (error) {
      console.error("Siparişler yüklenemedi.", error);
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Siparişler yüklenirken bir sorun oluştu.',
      });
    }
  }, [toast]);
  
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (status === 'shipped') {
        const order = orders.find(o => o.id === orderId);
        setSelectedOrder(order || null);
        setTrackingInfo(order?.tracking || { company: '', number: '' });
        setIsTrackingDialogOpen(true);
    } else {
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: status, tracking: undefined } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedOrders));
        toast({
          title: 'Sipariş Güncellendi',
          description: `Sipariş durumu "${status}" olarak değiştirildi.`,
        });
    }
  };

  const handleSaveTrackingInfo = () => {
    if (!selectedOrder || !trackingInfo.company || !trackingInfo.number) {
        toast({ variant: 'destructive', title: 'Eksik Bilgi', description: 'Kargo firması ve takip numarası girilmelidir.' });
        return;
    }
    const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id ? { ...order, status: 'shipped' as const, tracking: trackingInfo } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedOrders));
    toast({ title: 'Sipariş Kargoya Verildi', description: `Takip numarası eklendi.` });
    
    setIsTrackingDialogOpen(false);
    setSelectedOrder(null);
  };


  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
        case 'pending':
            return <Badge variant="outline">Ödeme Bekliyor</Badge>;
        case 'paid':
            return <Badge className='bg-green-100 text-green-800 border-green-200'>Ödendi</Badge>;
        case 'shipped':
            return <Badge className='bg-blue-100 text-blue-800 border-blue-200'>Kargolandı</Badge>;
        default:
            return <Badge variant="secondary">Bilinmiyor</Badge>;
    }
  }

  return (
    <>
    <div className="space-y-6">
       <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-headline">
                Sipariş Yönetimi
            </h1>
            <p className="text-muted-foreground">Verilen tüm basılı yıllık siparişlerini buradan yönetin.</p>
       </div>
       <Card>
        <CardHeader>
          <CardTitle>Alınan Siparişler</CardTitle>
          <CardDescription>
            En yeniden eskiye doğru sıralanmış siparişlerin listesi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Sipariş Tarihi</TableHead>
                  <TableHead>Kargo</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.customerName}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.price} TL</Badge>
                      </TableCell>
                       <TableCell>
                        {formatOrderDate(order.orderDate)}
                      </TableCell>
                       <TableCell>
                        {order.tracking?.number ? (
                             <Badge variant="outline">{order.tracking.number}</Badge>
                        ) : (
                           <Badge variant="ghost">Yok</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <FilePen className="mr-2 h-4 w-4" />
                                Yönet
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Durumu Değiştir</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'pending')}>Ödeme Bekliyor</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'paid')}>Ödendi</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'shipped')}>Kargolandı</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Henüz hiç sipariş yok.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
    <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Kargo Bilgilerini Girin</DialogTitle>
                <DialogDescription>Sipariş kargoya verildi olarak işaretlendi. Lütfen kargo takip bilgilerini girin.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="cargo-company" className='flex items-center'><Package className='w-4 h-4 mr-2' /> Kargo Firması</Label>
                    <Input id="cargo-company" value={trackingInfo.company} onChange={(e) => setTrackingInfo({...trackingInfo, company: e.target.value})} placeholder="Örn: MNG Kargo" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tracking-number" className='flex items-center'><Truck className='w-4 h-4 mr-2' /> Kargo Takip Numarası</Label>
                    <Input id="tracking-number" value={trackingInfo.number} onChange={(e) => setTrackingInfo({...trackingInfo, number: e.target.value})} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsTrackingDialogOpen(false)}>İptal</Button>
                <Button onClick={handleSaveTrackingInfo}>Kaydet ve Gönder</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
