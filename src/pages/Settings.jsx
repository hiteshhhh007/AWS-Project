import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/components/providers/theme-provider';
import { useToast } from '@/components/ui/use-toast';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [autoUpload, setAutoUpload] = useState(false);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Appearance</h2>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Theme</label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred theme
                </p>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-background border rounded-md px-3 py-2"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Push Notifications</label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about updates
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upload Settings</h2>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Auto Upload</label>
                <p className="text-sm text-muted-foreground">
                  Automatically upload images when added to watch folder
                </p>
              </div>
              <Switch
                checked={autoUpload}
                onCheckedChange={setAutoUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
