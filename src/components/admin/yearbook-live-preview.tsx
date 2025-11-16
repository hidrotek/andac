
'use client';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { User as StudentUser } from '@/components/admin/user-management';
import Image from 'next/image';
import { FileImage } from 'lucide-react';


function MediaItem({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  if (!src) {
    return (
        <div className={cn(className, "bg-secondary flex items-center justify-center border")}>
            <FileImage className="w-1/4 h-1/4 text-muted-foreground" />
        </div>
    );
  }
    
  const isVideo = src.startsWith('data:video');

  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return <Image src={src} alt={alt} width={400} height={400} className={className} />;
}


export type DesignSettings = {
  layout: string;
  fontFamily: {
    name: string;
    quote: string;
  };
  fontSize: {
    name: string;
    quote: string;
  };
  color: {
    background: string;
    text: string;
    accent: string;
  };
  photoFrame: string;
  backgroundImage: string | null;
};

// Bu, öğrenci sayfasından alınan verileri temsil eder
export type StudentPageData = {
  quote?: string;
  memories?: string;
  profilePhotoUrl?: string; // URL
  galleryPhotoUrls?: string[];
};


interface YearbookLivePreviewProps {
  settings: DesignSettings;
  student: StudentUser | null;
  studentPageData?: StudentPageData | null;
}

const defaultStudentPageData: StudentPageData = {
    quote: "Gelecek, hayallerinin güzelliğine inananlarındır.",
    memories: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper Congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper Congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.",
    profilePhotoUrl: "https://picsum.photos/seed/student-preview/400/400",
    galleryPhotoUrls: [],
};

const fontClassMap: { [key: string]: string } = {
  'poppins': 'font-headline',
  'pt-sans': 'font-body',
  'roboto': 'font-sans',
  'serif': 'font-serif',
};

export function YearbookLivePreview({ settings, student, studentPageData }: YearbookLivePreviewProps) {
  const name = student?.name || 'Öğrenci Adı';
  
  const finalStudentData = {
    profilePhotoUrl: studentPageData?.profilePhotoUrl || student?.photoUrl || defaultStudentPageData.profilePhotoUrl!,
    quote: studentPageData?.quote || defaultStudentPageData.quote,
    memories: studentPageData?.memories || defaultStudentPageData.memories,
  };


  const pageStyle: React.CSSProperties = {
    backgroundColor: settings.color.background,
    color: settings.color.text,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  if (settings.backgroundImage) {
    pageStyle.backgroundImage = `url(${settings.backgroundImage})`;
  }


  const nameStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize.name}px`,
    color: settings.color.accent,
  };

  const quoteStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize.quote}px`,
  };
  
  const longTextStyle: React.CSSProperties = {
    fontSize: `calc(${settings.fontSize.quote}px * 0.9)`,
  };

  const photoFrameClasses = cn({
    'rounded-none': settings.photoFrame === 'square',
    'rounded-lg': settings.photoFrame === 'rounded',
    'rounded-full': settings.photoFrame === 'circle',
  });

  const getLayout = () => {

    const classicLayout = (photoPosition: 'left' | 'right') => {
      return (
        <div className='p-6 h-full w-full overflow-hidden'>
             <div className="flex flex-col h-full">
                <h2 
                    className={cn('font-bold !leading-tight', fontClassMap[settings.fontFamily.name])} 
                    style={nameStyle}
                >
                    {name}
                </h2>
                {finalStudentData.quote && 
                    <p className={cn('italic mt-2 mb-4', fontClassMap[settings.fontFamily.quote])} style={quoteStyle}>
                        "{finalStudentData.quote}"
                    </p>
                }
                
                <div className="flex-grow overflow-auto">
                    <div
                        className={cn(
                            "relative w-1/3 aspect-square mb-2 shape-outside-circle",
                            photoPosition === 'left' ? "float-left mr-4" : "float-right ml-4",
                            settings.photoFrame === 'circle' && 'shape-outside-circle'
                        )}
                        style={settings.photoFrame === 'circle' ? { clipPath: 'circle(50% at 50% 50%)' } : {}}
                    >
                        <MediaItem
                            src={finalStudentData.profilePhotoUrl}
                            alt={name}
                            className={cn("w-full h-full object-cover", photoFrameClasses)}
                        />
                    </div>

                    <p 
                        className={cn("text-justify leading-relaxed", fontClassMap[settings.fontFamily.quote])} 
                        style={longTextStyle}
                    >
                        {finalStudentData.memories}
                    </p>
                </div>
            </div>
        </div>
      );
    }
    
    const studentPhotoModernCenter = (
       <div className="w-1/2 h-auto aspect-[3/4] p-2 bg-white shadow-lg">
        <MediaItem
          src={finalStudentData.profilePhotoUrl}
          alt={name}
          className={cn("w-full h-full object-cover", photoFrameClasses)}
        />
      </div>
    );
    
    const studentInfoModernCenter = (
        <div className="w-full text-center p-4">
            <div className="flex flex-col justify-center h-full">
                <h2 
                    className={cn('font-bold', fontClassMap[settings.fontFamily.name])} 
                    style={{...nameStyle }}
                >
                    {name}
                </h2>
                {finalStudentData.quote && <p className={cn('italic mt-2', fontClassMap[settings.fontFamily.quote])} style={quoteStyle}>
                    "{finalStudentData.quote}"
                </p>}
                 <ScrollArea className="h-24 mt-4 pr-3">
                     <p className={cn("text-left text-xs leading-relaxed space-y-2", fontClassMap[settings.fontFamily.quote])} style={longTextStyle}>
                       {finalStudentData.memories}
                    </p>
                </ScrollArea>
            </div>
        </div>
    );

    switch (settings.layout) {
      case 'classic-left':
        return classicLayout('left');
      case 'classic-right':
        return classicLayout('right');
      case 'modern-center':
        return <div className="flex flex-col w-full h-full items-center justify-center gap-4 p-4">{studentPhotoModernCenter}{studentInfoModernCenter}</div>;
      default:
        return classicLayout('left');
    }
  };

  return (
    <div
      style={pageStyle}
      className="w-full h-full transition-all duration-300 relative"
    >
        {getLayout()}
    </div>
  );
}
