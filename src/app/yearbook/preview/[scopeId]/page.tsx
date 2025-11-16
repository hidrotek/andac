'use client';

import React, { useEffect, useState, useRef, useCallback, forwardRef, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { YearbookLivePreview, type DesignSettings, type StudentPageData } from '@/components/admin/yearbook-live-preview';
import type { User as StudentUser } from '@/components/admin/user-management';
import type { FlipbookSettings as TFlipbookSettings } from '@/components/admin/flipbook-settings';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import HTMLFlipBook with SSR turned off
const HTMLFlipBook = dynamic(() => import('react-pageflip'), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>,
});


type Cover = {
  type: 'image' | 'video' | 'pdf-page';
  url: string;
};

type FullDesignSettings = {
  pageSettings: DesignSettings;
  flipbookSettings: TFlipbookSettings;
  deadline?: string;
  frontCovers?: Cover[];
  backCovers?: Cover[];
};

const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; number: number }>(
  (props, ref) => {
    return (
      <div ref={ref} className="bg-background border flex items-center justify-center">
        <div className="w-full h-full">
           {props.children}
        </div>
      </div>
    );
  }
);
Page.displayName = 'Page';

const Cover = forwardRef<HTMLDivElement, { children: React.ReactNode; }>(
  (props, ref) => {
    return (
      <div ref={ref} className="bg-background border flex items-center justify-center">
        <div className="w-full h-full">
           {props.children}
        </div>
      </div>
    );
  }
);
Cover.displayName = 'Cover';

export default function YearbookPreviewPage() {
  const params = useParams<{ scopeId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<FullDesignSettings | null>(null);
  const [submittedUsers, setSubmittedUsers] = useState<StudentUser[]>([]);
  const [allPagesData, setAllPagesData] = useState<{[key: string]: StudentPageData}>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bookRef = useRef<any>(null);


  useEffect(() => {
    if (!params.scopeId) return;

    let localDesign: FullDesignSettings | null = null;
    let localSubmittedUsers: StudentUser[] = [];
    let localAllPagesData: {[key: string]: StudentPageData} = {};
    
    try {
      const designKey = `yearbook-design-${params.scopeId}`;
      const usersKey = `yearbook-users-${params.scopeId}`;
      
      const storedDesignRaw = localStorage.getItem(designKey);
      localDesign = storedDesignRaw ? JSON.parse(storedDesignRaw) : null;
      setDesign(localDesign);

      if (localDesign?.flipbookSettings.flipSound && audioRef.current) {
          audioRef.current.src = localDesign.flipbookSettings.flipSound;
      }
      
      const storedUsersRaw = localStorage.getItem(usersKey);
      if (storedUsersRaw) {
        const allUsers: StudentUser[] = JSON.parse(storedUsersRaw);
        localSubmittedUsers = allUsers.filter(u => u.pageSubmitted);
        setSubmittedUsers(localSubmittedUsers);
      }
      
      for(const user of localSubmittedUsers) {
          const pageDataKey = `yearbook-pagedata-${user.id}`;
          const pageDataRaw = localStorage.getItem(pageDataKey);
          if (pageDataRaw) {
              localAllPagesData[user.id] = JSON.parse(pageDataRaw);
          }
      }
      setAllPagesData(localAllPagesData);

    } catch (e) {
      console.error("Failed to load yearbook data from localStorage", e);
    } finally {
        setLoading(false);
    }

  }, [params.scopeId]);

  const onPage = (e: any) => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Yıllık verileri yükleniyor...</p>
      </div>
    );
  }
  
  if (!design || submittedUsers.length === 0) {
     return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center p-4">
        <h1 className="text-2xl font-bold">Önizleme Verisi Bulunamadı</h1>
        <p className="text-muted-foreground max-w-md">
          Bu yıllık için kaydedilmiş bir tasarım bulunamadı veya henüz hiçbir öğrenci sayfasını kilitleyip göndermedi.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const { flipbookSettings, pageSettings } = design;

  const CoverContent = ({ cover }: { cover: Cover }) => {
    if (cover.type === 'video') {
       return <video src={cover.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
    }
    return <img src={cover.url} alt="Kapak" className="w-full h-full object-cover" />;
  }
  
  const allFrontCovers = design.frontCovers || [];
  const allBackCovers = design.backCovers || [];


  return (
    <>
        <audio ref={audioRef} preload="auto" />
        <div 
          className="w-full min-h-screen p-4 md:p-8 flex flex-col items-center justify-center select-none overflow-hidden"
          style={{ 
            backgroundColor: flipbookSettings.appearance.backgroundColor,
            backgroundImage: design.pageSettings.backgroundImage ? `url(${design.pageSettings.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
            <div className="absolute top-4 left-4 z-20">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Geri Dön
                </Button>
            </div>
            
            <div className="w-full max-w-6xl aspect-[2/1]">
                 <HTMLFlipBook
                    width={500}
                    height={700}
                    size="stretch"
                    minWidth={315}
                    maxWidth={1000}
                    minHeight={400}
                    maxHeight={1500}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onPage}
                    ref={bookRef}
                    className="mx-auto shadow-2xl"
                    style={{
                        backgroundColor: flipbookSettings.appearance.backgroundColor
                    }}
                    startPage={0}
                    drawShadow={flipbookSettings.drawShadow}
                    flippingTime={flipbookSettings.flippingTime}
                    useMouseEvents={true}
                    startZIndex={0}
                    autoSize={true}
                    clickEventForward={true}
                >
                    {/* Ön Kapaklar */}
                    {allFrontCovers.map((cover, index) => (
                       <Cover key={`front-cover-${index}`}>
                           <CoverContent cover={cover} />
                       </Cover>
                    ))}
                    
                    {/* Sayfalar */}
                    {submittedUsers.map((user, index) => (
                        <Page key={user.id} number={index + 1}>
                             <YearbookLivePreview settings={pageSettings} student={user} studentPageData={allPagesData[user.id]} />
                        </Page>
                    ))}

                    {/* Arka Kapaklar */}
                    {allBackCovers.map((cover, index) => (
                       <Cover key={`back-cover-${index}`}>
                           <CoverContent cover={cover} />
                       </Cover>
                    ))}
                </HTMLFlipBook>
            </div>
        </div>
    </>
  );
}
