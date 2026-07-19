import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard, Users, Ruler, ShoppingCart, FileText, BarChart3, Settings, UserCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Orders', path: '/orders', icon: ShoppingCart },
  { label: 'Invoices', path: '/invoices', icon: FileText },
  { label: 'Reports', path: '/reports', icon: BarChart3, role: 'admin' },
  { label: 'Settings', path: '/settings', icon: Settings, role: 'admin' },
  { label: 'Profile', path: '/profile', icon: UserCircle },
];

export default function Sidebar({ open, setOpen }) {
  const { user } = useAuth();
  const location = useLocation();

  const filteredItems = navItems.filter(item => !item.role || user?.role === item.role);

  return (
    <aside className={cn(
      'fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out',
      open ? 'translate-x-0' : '-translate-x-full',
      'md:relative md:translate-x-0'
    )}>
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold">Tailor Shop</h1>
      </div>
      <nav className="mt-4 space-y-1 px-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}