import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] px-4 space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
      </div>
      <div className="space-x-4">
        <Button asChild variant="default">
          <Link to="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/gallery">View Gallery</Link>
        </Button>
      </div>
    </div>
  );
}
