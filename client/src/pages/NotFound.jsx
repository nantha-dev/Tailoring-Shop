import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">Page not found</p>
      <Button asChild className="mt-4"><Link to="/">Go Home</Link></Button>
    </div>
  );
}