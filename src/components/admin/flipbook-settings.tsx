"use client";

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
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Settings,
  Book,
  MousePointer,
  Palette,
  PlayCircle,
  BookOpen,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { Button } from '../ui/button';

export type FlipbookSettings = {
  flippingTime: number; // in ms
  direction: 'ltr' | 'rtl';
  showPageCorners: boolean;
  drawShadow: boolean;
  flipSound?: string; // URL to the sound file
  appearance: {
    backgroundColor: string;
    style: 'classic' | 'hardcover' | 'spiral';
    spiralColor: string;
  };
  controls: {
    singlePageMode: boolean;
  };
  automation: {
    autoPlay: boolean;
    flipInterval: number; // in ms
  };
};

interface FlipbookSettingsProps {
    settings: FlipbookSettings;
    onSettingsChange: (newSettings: FlipbookSettings) => void;
}

const soundOptions = [
    { name: 'Klasik', url: '/sounds/classic.mp3' },
    { name: 'Sert Kapak', url: '/sounds/hardcover.mp3' },
    { name: 'Hızlı', url: '/sounds/fast.mp3' },
    { name: 'Eski Kitap', url: '/sounds/old-book.mp3' },
    { name: 'Dijital', url: '/sounds/digital.mp3' },
];


export function FlipbookSettings({ settings, onSettingsChange }: FlipbookSettingsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleValueChange = <T extends keyof FlipbookSettings>(key: T, value: FlipbookSettings[T]) => {
      onSettingsChange({ ...settings, [key]: value });
  };

  const handleNestedValueChange = <T extends keyof FlipbookSettings, U extends keyof FlipbookSettings[T]>(part: T, key: U, value: FlipbookSettings[T][U]) => {
      onSettingsChange({
        ...settings,
        [part]: {
            ...(settings[part] as object),
            [key]: value
        } as FlipbookSettings[T]
      });
  };

  const handlePlaySound = (soundUrl: string) => {
    if (audioRef.current) {
        if (audioRef.current.src.endsWith(soundUrl) && !audioRef.current.paused) {
             audioRef.current.pause();
             audioRef.current.currentTime = 0;
             return;
        }

        audioRef.current.src = soundUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Ses dosyası çalınamadı:", e));
    }
  };


  return (
    <>
    <audio ref={audioRef} preload="auto" />
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> Görünüm
                </CardTitle>
                <CardDescription>Flipbook'un genel stilini ve arkaplanını belirleyin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Sayfa Çevirme Stili</Label>
                    <RadioGroup
                        value={settings.appearance.style}
                        onValueChange={(value: 'classic' | 'hardcover' | 'spiral') => handleNestedValueChange('appearance', 'style', value)}
                        className="grid grid-cols-3 gap-4"
                    >
                        <div>
                            <RadioGroupItem value="classic" id="style-classic" className="peer sr-only" />
                            <Label htmlFor="style-classic" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                Klasik
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="hardcover" id="style-hardcover" className="peer sr-only" />
                            <Label htmlFor="style-hardcover" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                Sert Kapak
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="spiral" id="style-spiral" className="peer sr-only" />
                            <Label htmlFor="style-spiral" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                Spiralli
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className={cn("space-y-4 transition-opacity", settings.appearance.style !== 'spiral' && 'opacity-50 pointer-events-none')}>
                    <div className="flex items-center justify-between">
                        <Label>Spiral Rengi</Label>
                        <Input 
                            type="color" 
                            value={settings.appearance.spiralColor}
                            onChange={(e) => handleNestedValueChange('appearance', 'spiralColor', e.target.value)}
                            className="w-24 p-1"
                            disabled={settings.appearance.style !== 'spiral'}
                        />
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <Label>Arkaplan Rengi</Label>
                    <Input 
                        type="color" 
                        value={settings.appearance.backgroundColor}
                        onChange={(e) => handleNestedValueChange('appearance', 'backgroundColor', e.target.value)}
                        className="w-24 p-1"
                    />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" /> Etkileşim ve Efektler
                </CardTitle>
                <CardDescription>Sayfa çevirme davranışını ve görsel efektleri ayarlayın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="direction">Sayfa Çevirme Yönü</Label>
                    <Select
                        value={settings.direction}
                        onValueChange={(value: 'ltr' | 'rtl') => handleValueChange('direction', value)}
                    >
                    <SelectTrigger id="direction">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ltr">Soldan Sağa (Kitap)</SelectItem>
                        <SelectItem value="rtl">Sağdan Sola (Ajanda)</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="draw-shadow-switch">Sayfa Arası Gölge</Label>
                    <Switch
                        id="draw-shadow-switch"
                        checked={settings.drawShadow}
                        onCheckedChange={(checked) => handleValueChange('drawShadow', checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="show-corners-switch">Sayfa Çevirme Köşeleri</Label>
                    <Switch
                        id="show-corners-switch"
                        checked={settings.showPageCorners}
                        onCheckedChange={(checked) => handleValueChange('showPageCorners', checked)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="flipping-time">Sayfa Çevirme Hızı (milisaniye)</Label>
                    <div className="flex items-center gap-4">
                       <Slider
                            id="flipping-time"
                            min={200}
                            max={2000}
                            step={100}
                            value={[settings.flippingTime]}
                            onValueChange={(value) => handleValueChange('flippingTime', value[0])}
                        />
                        <span className="w-20 text-center font-mono text-sm">
                            {settings.flippingTime}ms
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" /> Sayfa Çevirme Sesi
                </CardTitle>
                <CardDescription>Sayfa çevrildiğinde çalacak sesi seçin. Bu ses dosyaları public/sounds/ altında bulunmalıdır.</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup 
                    value={settings.flipSound || ''} 
                    onValueChange={(value) => handleValueChange('flipSound', value)}
                    className="space-y-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="" id="sound-none" />
                        <Label htmlFor="sound-none" className="flex items-center gap-2 font-normal">
                             <VolumeX className="w-4 h-4 text-muted-foreground" />
                            Ses Yok
                        </Label>
                    </div>
                    {soundOptions.map(sound => (
                        <div key={sound.url} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={sound.url} id={`sound-${sound.name}`} />
                                <Label htmlFor={`sound-${sound.name}`} className="font-normal">{sound.name}</Label>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handlePlaySound(sound.url)}>
                                <PlayCircle className="w-5 h-5" />
                                <span className="sr-only">{sound.name} sesini dinle</span>
                            </Button>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>

       <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" /> Kontroller ve Otomasyon
            </CardTitle>
            <CardDescription>Kullanıcı kontrollerini ve otomatik oynatma ayarlarını yapılandırın.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                 <div className="flex items-center space-x-2 rounded-md border p-4 h-full">
                    <Switch
                    id="single-page-mode"
                    checked={settings.controls.singlePageMode}
                    onCheckedChange={(checked) => handleNestedValueChange('controls', 'singlePageMode', checked)}
                    />
                    <div>
                    <Label htmlFor="single-page-mode">Varsayılan Tek Sayfa Modu</Label>
                    <p className="text-xs text-muted-foreground">Mobil cihazlar için önerilir.</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-2 rounded-md border p-4 h-full">
                    <Switch
                        id="autoplay-switch"
                        checked={settings.automation.autoPlay}
                        onCheckedChange={(checked) => handleNestedValueChange('automation', 'autoPlay', checked)}
                    />
                    <div>
                        <Label htmlFor="autoplay-switch">Otomatik Oynat</Label>
                         <p className="text-xs text-muted-foreground">Flipbook otomatik olarak başlasın.</p>
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="flip-interval">Otomatik Geçiş Süresi (saniye)</Label>
                    <div className="flex items-center gap-4">
                       <Slider
                            id="flip-interval"
                            min={1}
                            max={30}
                            step={1}
                            value={[settings.automation.flipInterval / 1000]}
                            onValueChange={(value) => handleNestedValueChange('automation', 'flipInterval', value[0] * 1000)}
                            disabled={!settings.automation.autoPlay}
                        />
                        <span className="w-12 text-center font-mono text-sm">
                            {settings.automation.flipInterval / 1000}s
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
    </>
  );
}
