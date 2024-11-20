import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { confirmSignUp, resendCode, loading, error, clearError, pendingUsername } = useAuthStore();
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pendingUsername) {
      toast({
        title: "Error",
        description: "No pending confirmation. Please sign up first.",
        variant: "destructive"
      });
      navigate('/signup');
      return;
    }

    const success = await confirmSignUp(code);
    
    if (success) {
      toast({
        title: "Success",
        description: "Email confirmed successfully! You can now sign in.",
      });
      navigate('/signin');
    }
  };

  const handleResendCode = async () => {
    const success = await resendCode();
    if (success) {
      toast({
        title: "Code sent!",
        description: "A new verification code has been sent to your email.",
      });
    }
  };

  const handleChange = (e) => {
    setCode(e.target.value);
    if (error) clearError();
  };

  if (!pendingUsername) {
    navigate('/signup');
    return null;
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Please enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Input
              type="text"
              value={code}
              onChange={handleChange}
              placeholder="Enter verification code"
              className="text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Verify Email'}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <div className="text-sm">
            <Button
              variant="link"
              onClick={handleResendCode}
              disabled={loading}
              className="p-0 h-auto font-normal"
            >
              Resend verification code
            </Button>
          </div>
          <div className="text-sm">
            <Link 
              to="/signin"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
