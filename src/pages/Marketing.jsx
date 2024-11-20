import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Marketing() {
  return (
    <div className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your Smart Image Gallery
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Organize, search, and share your photos with AI-powered features. Experience a new way to manage your memories.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg" className="animate-in fade-in-50 duration-500">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="animate-in fade-in-50 duration-500 delay-200">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-4 text-xl font-bold">AI-Powered Search</h3>
              <p className="text-muted-foreground">
                Find your photos using natural language. Just describe what you're looking for.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-4 text-xl font-bold">Smart Organization</h3>
              <p className="text-muted-foreground">
                Automatically categorize and tag your photos for easy browsing.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-4 text-xl font-bold">Secure Storage</h3>
              <p className="text-muted-foreground">
                Your photos are encrypted and safely stored in the cloud.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
