import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Image, User, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  const navItems = [
    { to: '/gallery', icon: Image, label: 'Gallery' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="w-64 h-full border-r bg-card shadow-sm animate-in slide-in-from-left duration-300">
      <div className="p-6 flex flex-col h-full">
        <div className="space-y-2 mb-8">
          <h2 className="font-semibold text-lg tracking-tight">{user?.username}</h2>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium
                transition-all duration-200 hover:bg-accent
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-foreground/60 hover:text-foreground'}
              `}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
