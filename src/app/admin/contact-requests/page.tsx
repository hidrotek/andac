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
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContactRequest } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';


export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const { toast } = useToast();
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;
    try {
      const q = query(collection(firestore, 'contact-requests'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactRequest));
        setRequests(reqs);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("İletişim talepleri yüklenemedi.", error);
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'İletişim talepleri yüklenirken bir sorun oluştu.',
      });
    }
  }, [firestore, toast]);
  
  const handleDeleteRequest = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'contact-requests', id));
      toast({
        title: 'Talep Silindi',
        description: 'İletişim talebi başarıyla silindi.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Talep silinirken bir sorun oluştu.',
      });
    }
  };

  const formatRequestDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-headline">
                İletişim & Teklif Talepleri
            </h1>
            <p className="text-muted-foreground">Ana sayfa üzerinden gönderilen teklif taleplerini buradan yönetin.</p>
       </div>
       <Card>
        <CardHeader>
          <CardTitle>Alınan Talepler</CardTitle>
          <CardDescription>
            En yeniden eskiye doğru sıralanmış taleplerin listesi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Okul Adı</TableHead>
                  <TableHead>Gönderen</TableHead>
                  <TableHead>İletişim</TableHead>
                  <TableHead>Talep Tarihi</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.schoolName}</TableCell>
                      <TableCell>{req.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <a href={`mailto:${req.email}`} className="text-sm text-primary hover:underline">{req.email}</a>
                          <a href={`tel:${req.phone}`} className="text-sm text-muted-foreground hover:underline">{req.phone}</a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{formatRequestDate(req.date)}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(req.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Talebi Sil</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Henüz hiç iletişim talebi yok.
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
