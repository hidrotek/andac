"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export function ProfileSettings() {
  const { toast } = useToast();
  const [email, setEmail] = useState("seoizmirseo@gmail.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    try {
      const adminCredsRaw = localStorage.getItem('admin-credentials');
      if (adminCredsRaw) {
        const adminCreds = JSON.parse(adminCredsRaw);
        setEmail(adminCreds.email);
        // Güvenlik nedeniyle şifreyi forma doldurmuyoruz, sadece state'de tutabiliriz
        // ama en iyisi hiç tutmamak ve sadece doğrulama için kullanmak.
      }
    } catch (error) {
      console.error("Yönetici bilgileri yüklenemedi", error);
    }
  }, []);

  const handleSave = () => {
    try {
      // Mevcut bilgileri al
      const adminCredsRaw = localStorage.getItem('admin-credentials');
      const adminCreds = adminCredsRaw ? JSON.parse(adminCredsRaw) : {};

      // Şifre değiştirme mantığı
      if (newPassword) {
        if (currentPassword !== adminCreds.password) {
          toast({
            variant: "destructive",
            title: "Hata!",
            description: "Mevcut şifreniz yanlış.",
          });
          return;
        }
        if (newPassword !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "Hata!",
            description: "Yeni şifreler eşleşmiyor.",
          });
          return;
        }
        adminCreds.password = newPassword;
      }
      
      // E-postayı güncelle
      adminCreds.email = email;

      // Yeni bilgileri kaydet
      localStorage.setItem('admin-credentials', JSON.stringify(adminCreds));

      toast({
        title: 'Profil Güncellendi',
        description: 'Yönetici bilgileriniz başarıyla kaydedildi.',
      });

      // Formu temizle
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Ayarlar kaydedilemedi.',
      });
    }
  };


  return (
    <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
            <Label htmlFor="admin-email">E-posta Adresi</Label>
            <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="max-w-xs" />
        </div>
         <div className="space-y-4 rounded-md border p-4">
             <h4 className="font-medium">Şifre Değiştir</h4>
            <div className="space-y-2">
                <Label htmlFor="current-password">Mevcut Şifre</Label>
                <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="max-w-xs" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-password">Yeni Şifre</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="max-w-xs" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="max-w-xs" />
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
