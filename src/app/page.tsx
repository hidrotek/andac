
"use client";

import Link from 'next/link';
import { GraduationCap, BookOpen, Share2, Leaf, Rocket, ArrowRight, ShieldCheck, Send, User, School, Phone, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ContactRequest } from './admin/contact-requests/page';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Home() {
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [appName, setAppName] = useState('Dijital Andaç');
  const [appSlogan, setAppSlogan] = useState('Anılarınızı Dijitalde Ölümsüzleştirin');

  useEffect(() => {
    try {
        const settingsRaw = localStorage.getItem('app-settings');
        if (settingsRaw) {
            const settings = JSON.parse(settingsRaw);
            setAppName(settings.appName || 'Dijital Andaç');
            setAppSlogan(settings.appSlogan || 'Anılarınızı Dijitalde Ölümsüzleştirin');
            setWhatsappNumber(settings.whatsappNumber || '');
        }
    } catch (error) {
        console.error("Could not load app settings", error);
    }
  }, []);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
        toast({
            variant: 'destructive',
            title: 'Doğrulama Gerekli',
            description: "Lütfen 'Ben robot değilim' kutusunu işaretleyin.",
        });
        return;
    }
    
    setIsLoading(true);

    const newRequest: ContactRequest = {
        id: Date.now(),
        schoolName,
        name,
        email,
        phone,
        date: new Date().toISOString(),
    };
    
    setTimeout(() => {
        try {
            const existingRequestsRaw = localStorage.getItem('contact-requests');
            const existingRequests: ContactRequest[] = existingRequestsRaw ? JSON.parse(existingRequestsRaw) : [];
            localStorage.setItem('contact-requests', JSON.stringify([newRequest, ...existingRequests]));

            toast({
                title: 'Talep Gönderildi!',
                description: 'Teklif talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.',
            });
            
            // Reset form
            setName('');
            setSchoolName('');
            setEmail('');
            setPhone('');
            setIsVerified(false);

        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Hata!',
                description: "Talebiniz gönderilirken bir sorun oluştu.",
            });
        } finally {
            setIsLoading(false);
        }
    }, 1500);
  };

  const openWhatsApp = () => {
    if (whatsappNumber) {
        window.open(`https://wa.me/${whatsappNumber.replace(/\s+/g, '')}`, '_blank');
    } else {
        toast({
            variant: 'destructive',
            title: 'Numara Ayarlanmamış',
            description: 'Canlı destek için henüz bir WhatsApp numarası ayarlanmamış.',
        });
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:flex">
        <div className="container mx-auto h-14 flex items-center">
          <Link href="/" className="flex items-center gap-3 mr-auto">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-foreground tracking-tight">
              {appName}
            </h1>
          </Link>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            {whatsappNumber && (
                 <Button variant="outline" onClick={openWhatsApp}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Canlı Destek
                </Button>
            )}
            <Button asChild>
              <Link href="/login">
                Giriş Yap <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold !leading-tight tracking-tighter">
                {appSlogan.split(' ').slice(0, -1).join(' ')} <span className="text-primary">{appSlogan.split(' ').slice(-1)}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
                Okul yıllarınızı, arkadaşlıklarınızı ve unutulmaz anılarınızı modern ve interaktif bir platformda bir araya getirin. {appName} ile anılarınız her zaman, her yerde sizinle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="font-bold">
                  <Link href="/login">Hemen Giriş Yap</Link>
                </Button>
              </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Neden {appName}?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Klasik yıllıkların ötesine geçin. {appName}, anılarınızı daha canlı ve erişilebilir kılar.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<BookOpen className="w-10 h-10 text-primary" />}
                title="Zamansız Anılar"
                description="Yıllar geçse de solmayan, yıpranmayan dijital sayfalarla anılarınızı ilk günkü gibi taze tutun."
              />
              <FeatureCard
                icon={<Rocket className="w-10 h-10 text-primary" />}
                title="İnteraktif & Zengin İçerik"
                description="Sadece fotoğraflar değil; videolar, ses kayıtları ve kişisel notlarla yıllığınızı zenginleştirin."
              />
              <FeatureCard
                icon={<Share2 className="w-10 h-10 text-primary" />}
                title="Kolay Erişim ve Paylaşım"
                description="Yıllığınıza istediğiniz cihazdan ulaşın ve anılarınızı sevdiklerinizle kolayca paylaşın."
              />
              <FeatureCard
                icon={<Leaf className="w-10 h-10 text-primary" />}
                title="Çevre Dostu"
                description="Kağıt israfına son verin. Dijital çözümlerle doğayı koruyun ve daha yeşil bir gelecek bırakın."
              />
            </div>
          </div>
        </section>

        {/* Flipbook Sample Section */}
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Etkileşimli Yıllığınızı Keşfedin</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Sayfaları çevirerek dijital yıllığınızın nasıl görüneceğine dair bir önizleme yapın.
                </p>
                </div>
                <div className="flex justify-center p-8 bg-secondary rounded-lg">
                    <p className='text-muted-foreground'>Flipbook önizlemesi yakında burada olacak.</p>
                </div>
            </div>
        </section>
        
        {/* Quote Form Section */}
        <section id="quote-form" className="py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Okulunuza Özel Teklif Alın</h2>
                <p className="text-lg text-muted-foreground">
                    Kendi okulunuz için {appName}'ın sunduğu benzersiz deneyimi yaşamak ve anılarınızı ölümsüzleştirmek için ilk adımı atın. Aşağıdaki formu doldurun, size özel teklifimizle en kısa sürede geri dönüş yapalım.
                </p>
                 <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <span>Kolay yönetim paneli ve hızlı kurulum.</span>
                    </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <span>Her öğrenci için özelleştirilebilir dijital sayfalar.</span>
                    </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <span>Uygun fiyatlandırma ve esnek paket seçenekleri.</span>
                    </li>
                </ul>
            </div>
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle>Teklif Formu</CardTitle>
                <CardDescription>Bilgilerinizi doldurun, sizi arayalım.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleQuoteSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <Label htmlFor="schoolName">Okul Adı</Label>
                       <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="schoolName" placeholder="Gazi Anadolu Lisesi" required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="name">İsim Soyisim</Label>
                       <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" placeholder="Ali Yılmaz" required value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <Label htmlFor="email">E-posta Adresi</Label>
                       <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="ornek@eposta.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon Numarası</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder="555 123 4567" required value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="robot-check" checked={isVerified} onCheckedChange={(checked) => setIsVerified(checked as boolean)} />
                    <label
                      htmlFor="robot-check"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" /> Ben robot değilim
                    </label>
                  </div>
                   <Button type="submit" className="w-full font-bold !mt-8" disabled={isLoading}>
                    <Send className="mr-2 h-4 w-4" />
                    {isLoading ? 'Gönderiliyor...' : 'Teklif İste'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>
      
      {/* Footer for both */}
      <footer className="bg-secondary/50 border-t hidden md:block">
        <div className="container mx-auto py-6 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} {appName}. Tüm hakları saklıdır.</p>
        </div>
      </footer>

      {/* Mobile Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 md:hidden">
          <div className="flex items-center gap-2">
             <Button onClick={openWhatsApp} variant="outline" className="w-1/2 font-bold flex-1" style={{backgroundColor: '#25D366', color: 'white', borderColor: '#128C7E'}}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Canlı Destek
              </Button>
              <Button asChild className="w-1/2 font-bold flex-1">
                <Link href="/login">
                  Giriş Yap <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
          </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <CardHeader className="items-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
            {icon}
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

    



    