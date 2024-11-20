import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirect to signin while saving the attempted URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
