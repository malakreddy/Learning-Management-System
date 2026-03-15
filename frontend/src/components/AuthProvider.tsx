"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      // Protect routes logic
      // 1. Unauthenticated users:
      // - If on anything besides '/login', '/register', or '/', go to '/login'
      if (!isAuthenticated) {
        const publicPaths = ['/login', '/register', '/'];
        if (!publicPaths.includes(pathname)) {
          router.push('/login');
        }
      } 
      // 2. Authenticated users:
      // - If on '/login' or '/register', go to '/dashboard'
      // - (They ARE allowed to view the home page '/')
      else {
        if (pathname === '/login' || pathname === '/register') {
          router.push('/');
        }
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent flex"></div>
      </div>
    );
  }

  return <>{children}</>;
}
