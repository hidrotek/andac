'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";

export default function AdminRootPage() {
    const router = useRouter();
    const { user, loading, claims } = useUser();

    useEffect(() => {
        if (!loading) {
            if (user && claims?.role === 'admin') {
                router.replace('/admin/schools');
            } else if (user) {
                // Not an admin, redirect to student profile
                router.replace('/profile');
            } else {
                // Not logged in, redirect to login
                router.replace('/login');
            }
        }
    }, [router, user, loading, claims]);

    // Show a loading state while checking authentication
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">Yönlendiriliyorsunuz...</p>
        </div>
    );
}
