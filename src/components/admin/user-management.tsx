'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  PlusCircle,
  Mail,
  CheckCircle2,
  XCircle,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Lock,
  Unlock,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { EditUserDialog } from './edit-user-dialog';
import { User } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';


type FilterStatus = 'all' | 'registered' | 'pending';

export function UserManagement({
  scopeId,
  year,
}: {
  scopeId: string;
  year: string;
}) {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState('');
  const { toast } = useToast();
  const firestore = useFirestore();

  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const scopeParts = scopeId.split('-');
  const schoolId = scopeParts[0];
  const classId = scopeParts.length > 2 ? scopeParts.slice(2).join('-') : undefined;

  useEffect(() => {
    if (!firestore) return;

    let usersQuery = query(
      collection(firestore, 'users'),
      where('schoolId', '==', schoolId),
      where('year', '==', year)
    );

    if (classId) {
      usersQuery = query(usersQuery, where('classId', '==', classId));
    }

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, [firestore, schoolId, year, classId]);

  const handleSave = async () => {
    if (!firestore) return;
    const emailList = emails
      .split(/[\n,;]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (emailList.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Lütfen geçerli bir e-posta adresi girin.',
      });
      return;
    }

    let addedCount = 0;
    let existingCount = 0;

    const existingEmails = new Set(users.map(u => u.email.toLowerCase()));

    for (const email of emailList) {
      if (!existingEmails.has(email.toLowerCase())) {
        try {
          await addDoc(collection(firestore, 'users'), {
            email,
            schoolId,
            year,
            classId: classId || null,
            role: 'student',
            registered: false,
            pageSubmitted: false,
            createdAt: new Date().toISOString(),
          });
          addedCount++;
        } catch (error) {
          console.error(`Failed to add user ${email}:`, error);
        }
      } else {
        existingCount++;
      }
    }


    if (addedCount > 0) {
      toast({
        title: 'Başarılı!',
        description: `${addedCount} yeni kullanıcı davet listesine eklendi.`,
      });
    }
    if (existingCount > 0) {
        toast({
            variant: 'default',
            title: 'Bazı Kullanıcılar Zaten Mevcut',
            description: `${existingCount} kullanıcı zaten listede olduğu için tekrar eklenmedi.`,
        });
    }

    setEmails('');
    setOpen(false);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    if (!firestore || !updatedUser.id) return;
    
    const userRef = doc(firestore, 'users', updatedUser.id);
    // 'id' alanını Firestore'a yazmamak için kopyasını oluşturuyoruz.
    const { id, ...dataToSave } = updatedUser;
    
    try {
        await updateDoc(userRef, dataToSave);
        toast({
            title: 'Kullanıcı Güncellendi',
            description: `${updatedUser.name || updatedUser.email} için yapılan değişiklikler kaydedildi.`
        });
        setEditingUser(null);
        setSelectedUsers([]);
    } catch(error) {
        console.error("Error updating user:", error);
        toast({ variant: 'destructive', title: 'Hata!', description: 'Kullanıcı güncellenemedi.' });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'users', userId));
        toast({
            title: 'Kullanıcı Silindi',
            description: 'Seçilen kullanıcı davet listesinden kaldırıldı.'
        });
        setSelectedUsers(prev => prev.filter(id => id !== userId));
    } catch (error) {
        console.error("Error deleting user:", error);
        toast({ variant: 'destructive', title: 'Hata!', description: 'Kullanıcı silinemedi.' });
    }
  }

  const filteredUsers = users.filter((user) => {
    if (filter === 'registered') return user.registered;
    if (filter === 'pending') return !user.registered;
    return true;
  });

  const totalUsers = users.length;
  const registeredCount = users.filter((u) => u.registered).length;
  const registrationPercentage = totalUsers > 0 ? (registeredCount / totalUsers) * 100 : 0;

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSendReminder = () => {
    const pendingSelectedUsers = selectedUsers.filter(userId => {
        const user = users.find(u => u.id === userId);
        return user && !user.registered;
    });

    if (pendingSelectedUsers.length === 0) {
      toast({
        variant: 'destructive',
        title: 'İşlem Başarısız',
        description: 'Lütfen sadece "Bekleniyor" durumundaki kullanıcıları seçin.',
      });
      return;
    }
    toast({
      title: 'Hatırlatma Gönderildi',
      description: `${pendingSelectedUsers.length} kullanıcıya hatırlatma maili gönderildi. (Simülasyon)`,
    });
    setSelectedUsers([]);
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle>Kullanıcı Yönetimi</CardTitle>
            <CardDescription>
              Bu kapsama ait öğrencileri ve öğretmenleri yönetin. Sadece davet edilen
              kullanıcılar kayıt olabilir.
            </CardDescription>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Kayıt Durumu ({registeredCount}/{totalUsers})
              </span>
              <Progress value={registrationPercentage} className="w-[200px]" />
              <span className="text-sm font-bold">
                %{registrationPercentage.toFixed(0)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    İşlemler
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleSendReminder} disabled={selectedUsers.length === 0}>
                    <Mail className="mr-2 h-4 w-4" />
                    Seçilenlere Hatırlatma Gönder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-9 border-l" />

              <Button
                variant={filter === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Tümü
              </Button>
              <Button
                variant={filter === 'registered' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('registered')}
              >
                Kayıt Olanlar
              </Button>
              <Button
                variant={filter === 'pending' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Bekleyenler
              </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Kullanıcı Davet Et
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Kullanıcıları Davet Et</DialogTitle>
                  <DialogDescription>
                    Her satıra bir e-posta adresi gelecek şekilde listeyi
                    yapıştırın. Bu kullanıcılara kayıt olmaları için bir davet
                    bağlantısı gönderilecektir.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="emails">E-posta Adresleri</Label>
                    <Textarea
                      placeholder="ornek1@email.com, ornek2@email.com, ornek3@email.com"
                      id="emails"
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <p className="text-sm text-muted-foreground">
                      E-postaları virgül, noktalı virgül veya yeni satır ile ayırabilirsiniz.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button type="button" onClick={handleSave}>
                    Davetleri Gönder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                          ? true
                          : selectedUsers.length > 0
                          ? 'indeterminate'
                          : false
                      }
                      onCheckedChange={(checked) => handleSelectAll(checked)}
                    />
                  </TableHead>
                  <TableHead>İsim Soyisim</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Kayıt Durumu</TableHead>
                  <TableHead>Sayfa Durumu</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} data-state={selectedUsers.includes(user.id) && "selected"}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(
                                selectedUsers.filter((id) => id !== user.id)
                              );
                            }
                          }}
                        />
                      </TableCell>
                       <TableCell className="font-medium">{user.name || '-'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.registered ? (
                          <Badge variant="secondary" className="border-green-500/50 text-green-700">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            Kayıt Oldu
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-700">
                            <XCircle className="mr-2 h-4 w-4 text-amber-500" />
                            Bekleniyor
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.pageSubmitted ? (
                           <Badge variant="secondary" className="border-blue-500/50 text-blue-700">
                            <Lock className="mr-2 h-4 w-4 text-blue-500" />
                            Gönderildi
                          </Badge>
                        ) : (
                           <Badge variant="outline">
                            <Unlock className="mr-2 h-4 w-4" />
                            Açık
                          </Badge>
                        )}
                      </TableCell>
                       <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Menüyü aç</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => setEditingUser(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Bu filtreye uygun kullanıcı bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}
    </>
  );
}
