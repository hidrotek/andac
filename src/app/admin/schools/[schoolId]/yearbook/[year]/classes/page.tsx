'use client';

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const schoolData = {
  id: "1",
  name: "Gazi Anadolu Lisesi",
};

type SchoolClass = {
  id: string;
  name: string;
};

const initialClasses: SchoolClass[] = [
    { id: '12-a', name: '12-A' },
    { id: '12-b', name: '12-B' },
];

export default function ClassManagementPage() {
  const params = useParams<{ schoolId: string, year: string }>();
  const [classes, setClasses] = useState<SchoolClass[]>(initialClasses);
  const [newClassName, setNewClassName] = useState('');

  const handleAddClass = () => {
    if (newClassName.trim() === '') return;
    const newClass: SchoolClass = {
        id: newClassName.trim().replace(/\s+/g, '-').toLowerCase(),
        name: newClassName.trim(),
    };
    setClasses(prev => [...prev, newClass]);
    setNewClassName('');
  };


  return (
    <div className="space-y-6">
      <Button asChild variant="outline">
        <Link href={`/admin/schools/${params.schoolId}/yearbook/${params.year}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Yönetim Türü Seçimine Geri Dön
        </Link>
      </Button>

       <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-headline">
                {schoolData.name} - {params.year} Yılı Sınıf Yönetimi
            </h1>
            <p className="text-muted-foreground">Bu yıla ait sınıfları oluşturun ve yönetin.</p>
       </div>

        <Card>
            <CardHeader>
                <CardTitle>Yeni Sınıf Ekle</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 max-w-sm">
                    <Input 
                        placeholder="Örn: 12-C" 
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                    />
                    <Button onClick={handleAddClass}>
                        <Plus className="mr-2 h-4 w-4" />
                        Sınıf Ekle
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Mevcut Sınıflar</CardTitle>
                <CardDescription>Bu yıla ait sınıfların listesi.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Sınıf Adı</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {classes.length > 0 ? (
                            classes.map((cls) => (
                                <TableRow key={cls.id}>
                                    <TableCell className="font-medium">{cls.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild size="sm">
                                            <Link href={`/admin/schools/${params.schoolId}/yearbook/${params.year}/classes/${cls.id}`}>
                                                <Settings className="mr-2 h-4 w-4" />
                                                Yönet
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                    Bu yıl için henüz sınıf eklenmemiş.
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
