import { PackageOpen } from 'lucide-react';

export function EmptyState({ message = 'No data found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <PackageOpen className="h-12 w-12 mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}