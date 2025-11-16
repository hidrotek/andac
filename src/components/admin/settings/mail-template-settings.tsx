"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Code } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const shortcodes = [
    { code: "{{kullanici_adi}}", description: "Kullanıcının adı ve soyadı" },
    { code: "{{okul_adi}}", description: "Kullanıcının okulu" },
    { code: "{{yil}}", description: "Yıllığın ait olduğu mezuniyet yılı" },
    { code: "{{davet_linki}}", description: "Kullanıcının kayıt olacağı kişisel davet linki" },
    { code: "{{site_adi}}", description: "Uygulamanızın adı" },
];


export function MailTemplateSettings() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="mail-subject">E-Posta Konusu</Label>
                <Input id="mail-subject" defaultValue="{{site_adi}}'a Davet Edildiniz!" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="mail-content">E-Posta İçeriği</Label>
                <Textarea 
                    id="mail-content" 
                    className="min-h-[400px] font-mono text-sm"
                    defaultValue={`Merhaba {{kullanici_adi}},\n\n{{okul_adi}} {{yil}} yılı mezunları için hazırlanan dijital yıllığa anılarınızı eklemek üzere davet edildiniz.\n\nAşağıdaki bağlantıya tıklayarak kaydınızı tamamlayabilir ve arkadaşlarınızın sizin için yazdığı yazıları görebilirsiniz:\n\n{{davet_linki}}\n\nİyi eğlenceler!\n\nSaygılarımızla,\n{{site_adi}} Ekibi`}
                />
            </div>
             <div className="flex justify-start">
                <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Şablonu Kaydet
                </Button>
            </div>
        </div>
        <div className="space-y-4">
             <h4 className="font-semibold flex items-center">
                <Code className="mr-2 h-4 w-4"/>
                Kullanılabilir Kısa Kodlar
            </h4>
            <div className="space-y-3 rounded-md border p-4 bg-secondary/50">
                {shortcodes.map(sc => (
                    <div key={sc.code}>
                        <p className="text-sm font-mono font-semibold">{sc.code}</p>
                        <p className="text-xs text-muted-foreground">{sc.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
