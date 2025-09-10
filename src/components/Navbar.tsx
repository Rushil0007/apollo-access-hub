import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b-2 border-primary/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img 
              src="/lovable-uploads/28a15019-9e79-4ecf-86b9-e8de140ba48e.png" 
              alt="Apollo Tyres Logo" 
              className="h-10 w-auto hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-foreground font-bold text-xl">Apollo Tyres</span>
              <span className="text-xs text-muted-foreground">Project Portal</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-foreground font-semibold text-sm">{user.name}</span>
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium px-3 py-1 shadow-sm"
                >
                  {user.role === 'major-admin' ? 'Major Admin' : user.role === 'sub-admin' ? 'Sub Admin' : 'User'}
                </Badge>
              </div>
            </div>
            {(user.role === 'major-admin' || (user.role === 'sub-admin' && user.canManageUsers)) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 hover:text-primary font-medium transition-all duration-300 rounded-lg px-4"
                onClick={() => navigate('/admin')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive font-medium transition-all duration-300 rounded-lg px-4"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}