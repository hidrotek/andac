'use client'

import Link from "next/link";
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function YearbookYearManagementPage() {
  const params = useParams<{ schoolId: string, year: string }>();
  
  // Tüm yıl için benzersiz bir kimlik oluşturuyoruz.
  const uniqueScopeId = `${params.schoolId}-${params.year}`;

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
                {schoolData.name} - {params.year} Yılı (Genel Yıllık)
            </h1>
            <p className="text-muted-foreground">Tüm yıla ait kullanıcıları ve yıllık tasarımını bu sayfadan yönetin.</p>
       </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="users">Kullanıcı Yönetimi</TabsTrigger>
          <TabsTrigger value="yearbook">Yıllık Yönetimi</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement scopeId={uniqueScopeId} year={params.year} />
        </TabsContent>
        <TabsContent value="yearbook">
          <YearbookDesign scopeId={uniqueScopeId} year={params.year} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
