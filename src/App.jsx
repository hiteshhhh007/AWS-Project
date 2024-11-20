import { useEffect, Suspense } from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import ErrorHandler from '@/utils/errorHandler';
import Routes from '@/routes';
import { LoadingOverlay } from '@/components/ui/loading-spinner';
import { Toaster } from "@/components/ui/toaster";

function App() {
  useEffect(() => {
    ErrorHandler.init();
    return () => ErrorHandler.cleanup();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="gallery-theme">
        <Suspense fallback={<LoadingOverlay />}>
          <Routes />
        </Suspense>
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
