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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";


// Örnek okul verisi (normalde bu ID'ye göre veritabanından alınır)
const schoolData = {
  id: "1",
  name: "Gazi Anadolu Lisesi",
};


export default function SchoolDetailsPage() {
  const params = useParams<{ schoolId: string }>();
  const [year, setYear] = useState<number>(new Date().getFullYear() + 1);
  
  return (
    <div className="space-y-6">
      <Button asChild variant="outline">
        <Link href="/admin">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tüm Okullara Geri Dön
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{schoolData.name}</CardTitle>
          <CardDescription>
            Bu okulun mezuniyet andacını yönetmek için mezuniyet yılını seçin.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-6 border rounded-lg bg-background mt-4">
                <h3 className="font-medium mb-4">Mezuniyet Yılı Seçimi</h3>
                <div className="max-w-xs space-y-2">
                <Label htmlFor="year-input">Mezuniyet Yılı</Label>
                <Input
                    id="year-input"
                    type="number"
                    min="2025"
                    max="2100"
                    placeholder="Örn: 2025"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                />
                </div>
                <div className="mt-4">
                <Button asChild>
                    <Link href={`/admin/schools/${params.schoolId}/yearbook/${year}`}>
                        YILLIĞI YÖNET
                    </Link>
                </Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
