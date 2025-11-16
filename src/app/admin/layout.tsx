
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from './admin-sidebar';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <div className="flex h-full flex-col">
            <header className="border-b p-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold font-headline">Yönetim Paneli</h1>
                  <p className="text-sm text-muted-foreground hidden md:block">Okulları, kullanıcıları ve genel ayarları yönetin.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <ThemeToggle />
                <Button asChild variant="outline" size="sm">
                    <Link href="/login">Giriş Sayfasına Dön</Link>
                </Button>
              </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
