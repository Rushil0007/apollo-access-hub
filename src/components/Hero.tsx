import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-hero opacity-90"></div>
      
      {/* Animated circles */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-primary/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/30 rounded-full animate-float" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 rounded-full mb-6 backdrop-blur-sm">
            <div className="text-4xl font-bold text-white">A</div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
          APOLLO
          <span className="block text-primary text-4xl sm:text-5xl lg:text-6xl mt-2">
            TYRES
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
          Go The Distance with Innovation, Performance, and Reliability
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">Safety First</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">Performance</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">Global Reach</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.8s'}}>
          {user ? (
            <Link to="/dashboard" className="inline-block">
              <Button size="lg" className="btn-apollo text-lg px-8 py-4">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/login" className="inline-block">
              <Button size="lg" className="btn-apollo text-lg px-8 py-4">
                Access Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
          
          <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 animate-fade-in" style={{animationDelay: '1s'}}>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-white/80">Years of Excellence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">120+</div>
            <div className="text-white/80">Countries Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">1M+</div>
            <div className="text-white/80">Happy Customers</div>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}