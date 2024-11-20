import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SignUpForm from '@/components/auth/SignUpForm';
import SignInForm from '@/components/auth/SignInForm';
import ConfirmEmail from '@/components/auth/ConfirmEmail';
import Marketing from '@/pages/Marketing';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import { LoadingOverlay } from '@/components/ui/loading-spinner';

// Lazy-loaded pages with error boundaries
const Gallery = lazy(() => import('@/pages/Gallery').catch(error => {
  console.error('Error loading Gallery:', error);
  return { default: () => <div>Error loading Gallery</div> };
}));

const Profile = lazy(() => import('@/pages/Profile').catch(error => {
  console.error('Error loading Profile:', error);
  return { default: () => <div>Error loading Profile</div> };
}));

const Settings = lazy(() => import('@/pages/Settings').catch(error => {
  console.error('Error loading Settings:', error);
  return { default: () => <div>Error loading Settings</div> };
}));

// Wrap lazy components with Suspense
const LazyComponent = ({ component: Component }) => (
  <Suspense fallback={<LoadingOverlay />}>
    <Component />
  </Suspense>
);

// Router future flags for v7 compatibility
const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'marketing',
        element: <Marketing />
      },
      {
        path: 'signup',
        element: <SignUpForm />
      },
      {
        path: 'signin',
        element: <SignInForm />
      },
      // Legacy route redirects
      {
        path: 'login',
        element: <Navigate to="/signin" replace />
      },
      {
        path: 'register',
        element: <Navigate to="/signup" replace />
      },
      {
        path: 'confirm-email',
        element: <ConfirmEmail />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'gallery',
            element: <LazyComponent component={Gallery} />
          },
          {
            path: 'profile',
            element: <LazyComponent component={Profile} />
          },
          {
            path: 'settings',
            element: <LazyComponent component={Settings} />
          }
        ]
      },
      // Catch-all route
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
], {
  future: routerFutureConfig
});

export default function Routes() {
  return <RouterProvider router={router} future={routerFutureConfig} />;
}
