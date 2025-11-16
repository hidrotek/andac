'use client'

import Link from "next/link";
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/user-management";
import { YearbookDesign } from "@/components/admin/yearbook-design";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Örnek okul verisi (normalde bu ID'ye göre veritabanından alınır)
const schoolData = {
  id: "1",
  name: "Gazi Anadolu Lisesi",
};

export default function YearbookClassManagementPage() {
  const params = useParams<{ schoolId: string, year: string, classId: string }>();

  // Sınıf adını classId'den daha okunabilir bir formata çevirelim (örn: "12-a" -> "12-A")
  const className = params.classId ? params.classId.toString().toUpperCase().replace('-', ' ') : '';
  
  // Her sınıf için benzersiz bir kimlik oluşturuyoruz. 
  // Bu, kullanıcı listelerinin ve tasarımların çakışmasını önler.
  const uniqueScopeId = `${params.schoolId}-${params.year}-${params.classId}`;

  return (
    <div className="space-y-6">
        <Button asChild variant="outline">
            <Link href={`/admin/schools/${params.schoolId}/yearbook/${params.year}/classes`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Sınıf Listesine Geri Dön
            </Link>
        </Button>
       <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-headline">
                {schoolData.name} - {params.year} Yılı - {className} Sınıfı Yıllığı
            </h1>
            <p className="text-muted-foreground">Bu sınıfa ait kullanıcıları ve yıllık tasarımını bu sayfadan yönetin.</p>
       </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="users">Kullanıcı Yönetimi</TabsTrigger>
          <TabsTrigger value="yearbook">Yıllık Yönetimi</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          {/* UserManagement'a benzersiz kimliği gönderiyoruz. */}
          <UserManagement 
            scopeId={uniqueScopeId} 
            year={params.year} 
           />
        </TabsContent>
        <TabsContent value="yearbook">
           {/* YearbookDesign'a da benzersiz kimliği gönderiyoruz. */}
          <YearbookDesign 
            scopeId={uniqueScopeId} 
            year={params.year} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
