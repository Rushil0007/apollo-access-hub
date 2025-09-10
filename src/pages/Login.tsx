import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to Apollo Tyres Portal!",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const fillDemoCredentials = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('major@apollo.com');
      setPassword('apollo123');
    } else {
      setEmail('john@apollo.com');
      setPassword('apollo123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 w-full max-w-lg space-y-8 animate-slide-up">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/28a15019-9e79-4ecf-86b9-e8de140ba48e.png" 
              alt="Apollo Tyres Logo" 
              className="h-16 w-auto animate-float"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Apollo Tyres</h1>
          <p className="text-white/80 text-lg">Access your project portal</p>
        </div>

        {/* Login Form */}
        <Card className="glass-effect border-white/30 shadow-2xl backdrop-blur-lg animate-scale-in">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-white mb-2">Welcome Back</CardTitle>
            <CardDescription className="text-white/70 text-lg">
              Enter your credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-white/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-white/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-3 h-6 w-6 text-white/50 hover:text-white hover:bg-white/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 btn-apollo-glass text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="pt-6 border-t border-white/20">
              <p className="text-white/70 text-center mb-4 font-medium">Demo Credentials</p>
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-10 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                  onClick={() => fillDemoCredentials('admin')}
                >
                  🔑 Admin Demo (Full Access)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-10 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                  onClick={() => fillDemoCredentials('user')}
                >
                  👤 User Demo (Limited Access)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}