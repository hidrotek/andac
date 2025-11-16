
import { AppSettings } from "@/components/admin/settings/app-settings";
import { MailTemplateSettings } from "@/components/admin/settings/mail-template-settings";
import { ProfileSettings } from "@/components/admin/settings/profile-settings";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Mail, UserCog, Settings2 } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold font-headline">Genel Ayarlar</h1>
                <p className="text-muted-foreground mt-1">
                    Uygulama genelindeki ayarları ve tercihleri buradan yönetin.
                </p>
            </div>

            <Tabs defaultValue="app" className="w-full" orientation="vertical">
                {/* Desktop TabsList (Vertical) */}
                <TabsList className="hidden md:grid w-full grid-cols-1 h-full max-w-xs mr-6">
                    <TabsTrigger value="app" className="justify-start gap-2">
                        <Building />
                        Uygulama Ayarları
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="justify-start gap-2">
                        <UserCog />
                        Yönetici Profili
                    </TabsTrigger>
                    <TabsTrigger value="mail-templates" className="justify-start gap-2">
                        <Mail />
                        Mail Şablonları
                    </TabsTrigger>
                    <TabsTrigger value="mail-integration" className="justify-start gap-2">
                        <Settings2 />
                        Mail Entegrasyonu
                    </TabsTrigger>
                </TabsList>
                
                {/* Mobile TabsList (Horizontal) */}
                <div className="overflow-x-auto md:hidden -mx-4 px-4">
                     <TabsList className="grid-cols-none inline-grid auto-cols-auto">
                        <TabsTrigger value="app" className="gap-2">
                            <Building />
                            Uygulama
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="gap-2">
                            <UserCog />
                            Profil
                        </TabsTrigger>
                        <TabsTrigger value="mail-templates" className="gap-2">
                            <Mail />
                            Mail Şablonları
                        </TabsTrigger>
                        <TabsTrigger value="mail-integration" className="gap-2">
                            <Settings2 />
                            Mail Entegrasyonu
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="md:pl-4">
                    <TabsContent value="app">
                        <Card className="ml-0 md:ml-4 mt-4 md:mt-0">
                            <CardHeader>
                                <CardTitle>Uygulama ve Marka Ayarları</CardTitle>
                                <CardDescription>
                                    Uygulamanın logosunu, temel bilgilerini ve iletişim ayarlarını buradan güncelleyin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <AppSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="profile">
                        <Card className="ml-0 md:ml-4 mt-4 md:mt-0">
                            <CardHeader>
                                <CardTitle>Yönetici Profili</CardTitle>
                                <CardDescription>
                                    Kişisel bilgilerinizi ve şifrenizi buradan güncelleyebilirsiniz.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <ProfileSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="mail-templates">
                        <Card className="ml-0 md:ml-4 mt-4 md:mt-0">
                            <CardHeader>
                                <CardTitle>E-Posta Şablonu Ayarları</CardTitle>
                                <CardDescription>
                                    Öğrencilere ve kullanıcılara gönderilecek davet e-postalarını özelleştirin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <MailTemplateSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="mail-integration">
                        <Card className="ml-0 md:ml-4 mt-4 md:mt-0">
                            <CardHeader>
                                <CardTitle>Mail Entegrasyonu</CardTitle>
                                <CardDescription>
                                    E-postaların gönderileceği sunucu ayarlarını yapın.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <div className="space-y-6 max-w-md">
                                    {/* Mevcut Mail Entegrasyon Formu içeriği */}
                            </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
