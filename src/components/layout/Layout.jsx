import { Toaster } from '@/components/ui/toaster';
import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-[50vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default function Layout() {
  const location = useLocation();
  const { user } = useAuthStore();
  const isMarketing = location.pathname === '/';
  const isAuthPage = ['/signin', '/signup', '/confirm-email'].includes(location.pathname);

  // Marketing and auth pages get a simpler layout
  if (isMarketing || isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    );
  }

  // Authenticated app layout with sidebar
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="container mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
