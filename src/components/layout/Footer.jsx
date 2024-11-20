import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">Gallery App</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your personal cloud gallery for storing and sharing memories.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="mailto:support@galleryapp.com"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  support@galleryapp.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Gallery App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
