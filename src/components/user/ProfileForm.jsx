import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { userService } from '@/services/user';
import { useAuthStore } from '@/store/authStore';

export default function ProfileForm() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await userService.updateProfile(formData);
      setUser({ ...user, ...response.data });
      toast({ title: "Profile updated successfully" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={formData.email}
            disabled
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}
