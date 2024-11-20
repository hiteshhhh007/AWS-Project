import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth';

export default function ChangePasswordDialog({ open, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match"
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );
      toast({ title: "Password changed successfully" });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to change password",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Current Password</label>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={e => setFormData({
                ...formData,
                currentPassword: e.target.value
              })}
              required
              aria-label="Current Password"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">New Password</label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={e => setFormData({
                ...formData,
                newPassword: e.target.value
              })}
              required
              aria-label="New Password"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Confirm New Password</label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData({
                ...formData,
                confirmPassword: e.target.value
              })}
              required
              aria-label="Confirm New Password"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
