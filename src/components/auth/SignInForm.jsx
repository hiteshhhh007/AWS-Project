import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function SignInForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, loading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await signIn({
      username: formData.username,
      password: formData.password
    });

    if (success) {
      navigate('/gallery');
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">
              {error.message || error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
