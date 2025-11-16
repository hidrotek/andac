"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { GraduationCap, School, Settings, MessageCircleQuestion, Library, ShoppingCart, CreditCard, Box, Truck } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function AdminSidebar() {
  const pathname = usePathname();
  const [appName, setAppName] = useState('Dijital Andaç');
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;
    const settingsDoc = doc(firestore, 'settings', 'app');
    const unsubscribe = onSnapshot(settingsDoc, (doc) => {
        if (doc.exists()) {
            const settings = doc.data();
            setAppName(settings.appName || 'Dijital Andaç');
        }
    });
    return () => unsubscribe();
  }, [firestore]);

  useEffect(() => {
    if (pathname.startsWith('/admin/store')) {
      setIsStoreOpen(true);
    }
  }, [pathname]);


  const isActive = (path: string, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <Button variant="ghost" asChild className="h-10 w-full justify-start px-2 text-lg font-semibold font-headline">
          <Link href="/admin">
            <GraduationCap className="mr-2 h-6 w-6 flex-shrink-0" />
            <span className="truncate">{appName}</span>
          </Link>
        </Button>
        <SidebarTrigger className="hidden data-[state=expanded]:md:flex" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/admin/schools', true)} tooltip={{children: "Okullar"}}>
              <Link href="/admin/schools">
                <School />
                <span>Okullar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Collapsible open={isStoreOpen} onOpenChange={setIsStoreOpen}>
            <CollapsibleTrigger className="w-full">
               <SidebarMenuButton 
                  isActive={isActive('/admin/store')} 
                  className="w-full" 
                  tooltip={{children: "Mağaza Yönetimi"}}
                >
                <ShoppingCart />
                <span>Mağaza</span>
                <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 transition-transform duration-200", isStoreOpen && "rotate-180")} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="pl-8 py-1 flex flex-col gap-1">
                    <Link href="/admin/store/orders" className={cn("text-sm p-2 rounded-md hover:bg-sidebar-accent", isActive('/admin/store/orders') && "bg-sidebar-accent font-semibold")}>
                        Siparişler
                    </Link>
                    <Link href="/admin/store/products" className={cn("text-sm p-2 rounded-md hover:bg-sidebar-accent", isActive('/admin/store/products') && "bg-sidebar-accent font-semibold")}>
                        Ürünler
                    </Link>
                     <Link href="/admin/store/payments" className={cn("text-sm p-2 rounded-md hover:bg-sidebar-accent", isActive('/admin/store/payments') && "bg-sidebar-accent font-semibold")}>
                        Ödeme Yöntemleri
                    </Link>
                    <Link href="/admin/store/cargo" className={cn("text-sm p-2 rounded-md hover:bg-sidebar-accent", isActive('/admin/store/cargo') && "bg-sidebar-accent font-semibold")}>
                        Kargo Ayarları
                    </Link>
                </div>
            </CollapsibleContent>
          </Collapsible>


          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/admin/media-library')} tooltip={{children: "Ortam Kütüphanesi"}}>
              <Link href="/admin/media-library">
                <Library />
                <span>Ortam Kütüphanesi</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/admin/contact-requests')} tooltip={{children: "İletişim Talepleri"}}>
              <Link href="/admin/contact-requests">
                <MessageCircleQuestion />
                <span>İletişim Talepleri</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/admin/settings')} tooltip={{children: "Genel Ayarlar"}}>
              <Link href="/admin/settings">
                <Settings />
                <span>Genel Ayarlar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
