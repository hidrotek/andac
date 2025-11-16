"use client";

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, Unlock, User as UserIcon, Mail, KeyRound } from 'lucide-react';
import type { User } from './user-management';
import { useToast } from '@/hooks/use-toast';

interface EditUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

export function EditUserDialog({ user, isOpen, onClose, onSave }: EditUserDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPageLocked, setIsPageLocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email);
      setIsPageLocked(user.pageSubmitted);
      // Reset password fields when a new user is opened
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    // Check if new password is being set and if they match
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Yeni şifreler eşleşmiyor.',
      });
      return;
    }

    const updatedUser = {
      ...user,
      name: name,
      email: email,
      pageSubmitted: isPageLocked,
      // Only include password if it's being changed
      ...(newPassword && { password: newPassword }),
    };
    onSave(updatedUser);
    toast({
        title: 'Kullanıcı Güncellendi',
        description: `${name || email} için yapılan değişiklikler kaydedildi.`
    });
    onClose();
  };

  const handleUnlockPage = () => {
    setIsPageLocked(false);
    toast({
        title: 'Sayfa Kilidi Açıldı!',
        description: `${user.name || user.email} adlı kullanıcının yıllık sayfası artık düzenlenebilir.`,
        variant: 'default',
        className: 'bg-green-100 border-green-300 text-green-800'
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
          <DialogDescription>
            Kullanıcı bilgilerini güncelleyin, sayfa kilidini açın veya yeni şifre belirleyin.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className='flex items-center'><UserIcon className='w-4 h-4 mr-2' /> İsim Soyisim</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className='flex items-center'><Mail className='w-4 h-4 mr-2' /> E-posta Adresi</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
           <div className="space-y-3 rounded-md border p-4">
             <h4 className="font-medium text-sm flex items-center"><KeyRound className="w-4 h-4 mr-2" /> Şifre Değiştir</h4>
              <p className="text-xs text-muted-foreground">
                Kullanıcının şifresini değiştirmek için yeni bir şifre girin. Boş bırakırsanız mevcut şifre korunur.
              </p>
              <div className="space-y-2">
                  <Label htmlFor="new-password">Yeni Şifre</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
           </div>
          <div className="space-y-3">
             <Label>Yıllık Sayfası Durumu</Label>
              {isPageLocked ? (
                  <Alert variant="destructive">
                      <Lock className="h-4 w-4" />
                      <AlertTitle>Sayfa Kilitli</AlertTitle>
                      <AlertDescription>
                          Bu kullanıcının sayfası kilitlenmiş. Düzenlemeye açmak için aşağıdaki butonu kullanın.
                      </AlertDescription>
                      <Button variant="outline" size="sm" className="mt-4" onClick={handleUnlockPage}>
                          <Unlock className="mr-2 h-4 w-4"/>
                          Sayfa Kilidini Aç
                      </Button>
                  </Alert>
              ): (
                 <Alert>
                      <Unlock className="h-4 w-4" />
                      <AlertTitle>Sayfa Açık</AlertTitle>
                      <AlertDescription>
                          Kullanıcı şu anda yıllık sayfasını düzenleyebilir.
                      </AlertDescription>
                  </Alert>
              )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>İptal</Button>
          <Button onClick={handleSave}>Değişiklikleri Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
