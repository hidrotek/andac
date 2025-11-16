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
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Users, Users2 } from "lucide-react";

// Örnek okul verisi (normalde bu ID'ye göre veritabanından alınır)
const schoolData = {
  id: "1",
  name: "Gazi Anadolu Lisesi",
};

export default function YearbookManagementPage() {
  const params = useParams<{ schoolId: string, year: string }>();

  return (
    <div className="space-y-6">
        <Button asChild variant="outline">
            <Link href={`/admin/schools/${params.schoolId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Okul Detaylarına Geri Dön
            </Link>
        </Button>
       <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-headline">
                {schoolData.name} - {params.year} Yılı Andaç Yönetimi
            </h1>
            <p className="text-muted-foreground">Bu yıl için genel bir yıllık mı, yoksa sınıflara özel yıllıklar mı oluşturmak istersiniz?</p>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Genel Yıllık</CardTitle>
            <CardDescription>
              Tüm mezunları kapsayan tek bir yıllık oluşturun ve yönetin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
                <Link href={`/admin/schools/${params.schoolId}/yearbook/${params.year}/manage`}>
                    Tüm Yıl İçin Yönet <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:border-primary transition-colors">
          <CardHeader>
             <Users2 className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Sınıfa Özel Yıllık</CardTitle>
            <CardDescription>
              Farklı sınıflar için ayrı ayrı yıllıklar oluşturun ve yönetin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
                <Link href={`/admin/schools/${params.schoolId}/yearbook/${params.year}/classes`}>
                    Sınıfları Yönet <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
