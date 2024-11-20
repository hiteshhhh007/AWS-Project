import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Gallery App</span>
          </Link>
          {isAuthenticated() && (
            <nav className="flex items-center gap-6 text-sm">
              <Link
                to="/gallery"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Gallery
              </Link>
              <Link
                to="/profile"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Profile
              </Link>
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {isAuthenticated() ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
