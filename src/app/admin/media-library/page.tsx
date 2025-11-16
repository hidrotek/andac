'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Library, Upload } from "lucide-react";

export default function MediaLibraryPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                    <Library />
                    Ortam Kütüphanesi
                </h1>
                <p className="text-muted-foreground">Yıllık kapakları, logolar ve diğer medya varlıklarını yönetin.</p>
            </div>
            <Button>
                <Upload className="mr-2 h-4 w-4" />
                Yeni Dosya Yükle
            </Button>
       </div>
       <Card>
        <CardHeader>
          <CardTitle>Yüklenen Dosyalar</CardTitle>
          <CardDescription>
            Burada Firebase Storage'a yüklenen tüm dosyalar listelenecektir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            <p>Yakında: Ortam kütüphanesi burada görüntülenecek.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
