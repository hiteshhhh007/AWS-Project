import { useState } from 'react';
import ProfileForm from '@/components/user/ProfileForm';
import StorageUsage from '@/components/user/StorageUsage';
import ChangePasswordDialog from '@/components/user/ChangePasswordDialog';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Button onClick={() => setIsChangePasswordOpen(true)}>
          Change Password
        </Button>
      </div>

      <div className="grid gap-8">
        <ProfileForm />
        <StorageUsage used={user?.storageUsed || 0} total={1024 * 1024 * 1024} />
      </div>

      <ChangePasswordDialog 
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
