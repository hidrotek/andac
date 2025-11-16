
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import {
  Circle,
  FileImage,
  LayoutPanelLeft,
  Paintbrush,
  Palette,
  Square,
  Type,
} from 'lucide-react';
import { YearbookLivePreview } from './yearbook-live-preview';
import type { DesignSettings } from './yearbook-live-preview';

interface YearbookPageSettingsProps {
  settings: DesignSettings;
  onSettingsChange: (newSettings: DesignSettings) => void;
}

export function YearbookPageSettings({ settings, onSettingsChange }: YearbookPageSettingsProps) {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        onSettingsChange({
          ...settings,
          backgroundImage: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Ayarlar Bölümü */}
      <div className="space-y-8">
        {/* Sayfa Düzeni */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutPanelLeft className="h-5 w-5" /> Sayfa Düzeni
            </CardTitle>
            <CardDescription>
              Öğrenci sayfalarının genel yerleşimini seçin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={settings.layout}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, layout: value })
              }
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Label
                htmlFor="layout-1"
                className="block cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm has-[input:checked]:border-primary"
              >
                <div className="p-4 text-center">
                  <div className="w-full h-16 bg-secondary rounded-md flex items-center justify-center mb-2 text-xs text-muted-foreground">Foto Solda</div>
                  <p className="font-medium">Klasik Sol</p>
                </div>
                <RadioGroupItem
                  value="classic-left"
                  id="layout-1"
                  className="sr-only"
                />
              </Label>
              <Label
                htmlFor="layout-2"
                className="block cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm has-[input:checked]:border-primary"
              >
                <div className="p-4 text-center">
                   <div className="w-full h-16 bg-secondary rounded-md flex items-center justify-center mb-2 text-xs text-muted-foreground">Foto Sağda</div>
                  <p className="font-medium">Klasik Sağ</p>
                </div>
                <RadioGroupItem
                  value="classic-right"
                  id="layout-2"
                  className="sr-only"
                />
              </Label>
              <Label
                htmlFor="layout-3"
                className="block cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm has-[input:checked]:border-primary"
              >
                <div className="p-4 text-center">
                   <div className="w-full h-16 bg-secondary rounded-md flex items-center justify-center mb-2 text-xs text-muted-foreground">Foto Ortada</div>
                  <p className="font-medium">Modern Orta</p>
                </div>
                <RadioGroupItem
                  value="modern-center"
                  id="layout-3"
                  className="sr-only"
                />
              </Label>
              
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Arkaplan Ayarları */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Paintbrush className="h-5 w-5" /> Arkaplan Ayarları
                </CardTitle>
                <CardDescription>
                    Sayfa arkaplanını bir görsel veya renk ile özelleştirin.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="bg-image">Arkaplan Görseli Yükle</Label>
                    <Input id="bg-image" type="file" accept="image/*" onChange={handleFileChange} />
                    <p className="text-xs text-muted-foreground">Önerilen boyut: 21cm x 29.7cm (A4)</p>
                </div>
                 <div className="flex items-center justify-between">
                    <Label>Arkaplan Rengi</Label>
                    <Input 
                        type="color" 
                        value={settings.color.background}
                        onChange={(e) => onSettingsChange({...settings, color: {...settings.color, background: e.target.value}})}
                        className="w-24 p-1"
                    />
                </div>
            </CardContent>
        </Card>

        {/* Tipografi ve Renkler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" /> Tipografi
              </CardTitle>
              <CardDescription>
                Yazı tiplerini ve boyutlarını ayarlayın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Öğrenci Adı Fontu</Label>
                  <Select
                    value={settings.fontFamily.name}
                    onValueChange={(value) =>
                      onSettingsChange({
                        ...settings,
                        fontFamily: { ...settings.fontFamily, name: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="pt-sans">PT Sans</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Boyut (px)</Label>
                  <Input
                    type="number"
                    value={settings.fontSize.name}
                     onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        fontSize: { ...settings.fontSize, name: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Anı/Alıntı Fontu</Label>
                   <Select
                    value={settings.fontFamily.quote}
                    onValueChange={(value) =>
                      onSettingsChange({
                        ...settings,
                        fontFamily: { ...settings.fontFamily, quote: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="pt-sans">PT Sans</SelectItem>
                       <SelectItem value="roboto">Roboto</SelectItem>
                       <SelectItem value="serif">Serif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Boyut (px)</Label>
                   <Input
                    type="number"
                    value={settings.fontSize.quote}
                     onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        fontSize: { ...settings.fontSize, quote: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" /> Renk Paleti
              </CardTitle>
              <CardDescription>Yazı ve vurgu renkleri.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Yazı Rengi</Label>
                 <Input
                    type="color"
                    value={settings.color.text}
                     onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        color: { ...settings.color, text: e.target.value },
                      })
                    }
                    className="w-24 p-1"
                  />
              </div>
              <div className="flex items-center justify-between">
                <Label>Vurgu Rengi</Label>
                 <Input
                    type="color"
                    value={settings.color.accent}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        color: { ...settings.color, accent: e.target.value },
                      })
                    }
                    className="w-24 p-1"
                  />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fotoğraf Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" /> Fotoğraf Ayarları
            </CardTitle>
            <CardDescription>
              Öğrenci fotoğraflarının stilini belirleyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label>Fotoğraf Çerçeve Stili</Label>
             <RadioGroup
              value={settings.photoFrame}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, photoFrame: value })
              }
              className="flex items-center gap-4 mt-2"
            >
              <Label
                htmlFor="frame-square"
                className="flex items-center gap-2 cursor-pointer p-2 border rounded-md has-[input:checked]:border-primary"
              >
                <Square className="h-5 w-5" />
                <span>Kare</span>
                <RadioGroupItem
                  value="square"
                  id="frame-square"
                  className="sr-only"
                />
              </Label>
              <Label
                htmlFor="frame-rounded"
                className="flex items-center gap-2 cursor-pointer p-2 border rounded-md has-[input:checked]:border-primary"
              >
                <div className="h-5 w-5 border-2 rounded-md border-current"></div>
                <span>Yuvarlak Köşe</span>
                <RadioGroupItem
                  value="rounded"
                  id="frame-rounded"
                  className="sr-only"
                />
              </Label>
              <Label
                htmlFor="frame-circle"
                className="flex items-center gap-2 cursor-pointer p-2 border rounded-md has-[input:checked]:border-primary"
              >
                <Circle className="h-5 w-5" />
                <span>Daire</span>
                <RadioGroupItem
                  value="circle"
                  id="frame-circle"
                  className="sr-only"
                />
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

       {/* Canlı Önizleme Bölümü */}
      <div className="xl:sticky top-6 h-fit">
        <Card>
            <CardHeader>
                <CardTitle>Canlı Önizleme</CardTitle>
                <CardDescription>Tasarım ayarlarınız burada anlık olarak yansıtılacaktır.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full aspect-[210/297] border rounded-lg overflow-hidden shadow-lg">
                    <YearbookLivePreview settings={settings} student={null} />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    