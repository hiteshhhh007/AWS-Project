import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function StorageUsage({ used, total }) {
  const usedGB = (used / (1024 * 1024 * 1024)).toFixed(2);
  const totalGB = (total / (1024 * 1024 * 1024)).toFixed(2);
  const percentage = (used / total) * 100;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Storage Usage</h2>
      <Progress value={percentage} className="mb-4" />
      <p className="text-sm text-muted-foreground">
        {usedGB}GB used of {totalGB}GB
      </p>
    </Card>
  );
}
