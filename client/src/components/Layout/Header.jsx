import { Menu, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '../ui/avatar';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="hidden md:block" />
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{user?.name}</span>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/login'); }}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}