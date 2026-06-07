import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-px flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-8xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-3xl">Oops! Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          <Home className="h-4 w-4" /> Return to Home
        </Link>
        <Link to="/products" className="btn-outline">
          <ArrowLeft className="h-4 w-4" /> Browse Products
        </Link>
      </div>
    </div>
  );
}
