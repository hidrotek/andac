"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, UploadCloud } from "lucide-react";
import { useState } from "react";
import type { School } from "@/lib/types";

interface AddSchoolDialogProps {
  onAddSchool: (school: Omit<School, 'id' | 'createdAt' | 'studentCount'>) => void;
}

export function AddSchoolDialog({ onAddSchool }: AddSchoolDialogProps) {
  const [open, setOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!schoolName) return;
    
    // Form verilerini toplayıp üst bileşene gönder
    onAddSchool({ name: schoolName });
    
    // Formu sıfırla ve dialog'u kapat
    setSchoolName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Okul Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yeni Okul Ekle</DialogTitle>
            <DialogDescription>
              Yeni bir okul oluşturmak için aşağıdaki bilgileri eksiksiz doldurun.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="school-name">Okul Adı</Label>
              <Input
                id="school-name"
                placeholder="Örn: Gazi Anadolu Lisesi"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="school-contact">Okul İletişim Bilgileri</Label>
              <Input
                id="school-contact"
                placeholder="Telefon veya e-posta"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="city">İl</Label>
                <Select>
                    <SelectTrigger id="city">
                    <SelectValue placeholder="İl seçin" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="istanbul">İstanbul</SelectItem>
                    <SelectItem value="ankara">Ankara</SelectItem>
                    <SelectItem value="izmir">İzmir</SelectItem>
                    <SelectItem value="bursa">Bursa</SelectItem>
                    <SelectItem value="antalya">Antalya</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="district">İlçe</Label>
                    <Input
                        id="district"
                        placeholder="Örn: Çankaya"
                    />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                    id="address"
                    placeholder="Okulun tam adresini girin..."
                    className="min-h-[80px]"
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school-logo">Okul Logosu</Label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="school-logo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Yüklemek için tıklayın</span></p>
                          <p className="text-xs text-muted-foreground">SVG, PNG, JPG</p>
                      </div>
                      <Input id="school-logo" type="file" className="hidden" />
                  </label>
              </div> 
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>İptal</Button>
            <Button type="submit">Okulu Kaydet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
