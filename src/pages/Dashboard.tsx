import { useAuth } from '@/context/AuthContext';
import ProjectCard from '@/components/ProjectCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Shield, Globe } from 'lucide-react';

export default function Dashboard() {
  const { user, projects, hasAccess } = useAuth();
  
  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  const accessibleProjects = projects.filter(project => hasAccess(project.id));
  const restrictedProjects = projects.filter(project => !hasAccess(project.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome back, {user.name}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access your Apollo Tyres projects and tools from your personalized dashboard
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge 
              variant={user.role === 'major-admin' ? 'default' : user.role === 'sub-admin' ? 'secondary' : 'outline'}
              className="px-4 py-2 text-sm font-medium"
            >
              {user.role === 'major-admin' ? '👑 Major Administrator' : 
               user.role === 'sub-admin' ? '⚡ Sub Administrator' : 
               '👤 User'}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              📊 {accessibleProjects.length} of {projects.length} projects accessible
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
          <Card className="card-apollo group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accessible Projects</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-1">{accessibleProjects.length}</div>
              <p className="text-xs text-muted-foreground">
                Out of {projects.length} total projects
              </p>
            </CardContent>
          </Card>

          <Card className="card-apollo group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">User Role</CardTitle>
              <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                <Users className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary mb-1">
                {user.role === 'major-admin' ? 'Major Admin' : user.role === 'sub-admin' ? 'Sub Admin' : 'User'}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.role === 'major-admin' ? 'Full system access' : user.role === 'sub-admin' ? 'Limited admin access' : 'Project access only'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-apollo group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Security Level</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-1">High</div>
              <p className="text-xs text-muted-foreground">
                Enterprise grade security
              </p>
            </CardContent>
          </Card>

          <Card className="card-apollo group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Global Access</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
              <p className="text-xs text-muted-foreground">
                Available worldwide
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Accessible Projects */}
        {accessibleProjects.length > 0 && (
          <div className="mb-12 animate-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Your Projects
              </h2>
              <p className="text-muted-foreground text-lg">
                Click on any project card to access it instantly
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accessibleProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restricted Projects (if any) */}
        {restrictedProjects.length > 0 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                Restricted Access
              </h2>
              <p className="text-muted-foreground">
                The following projects require additional permissions. Contact your administrator for access.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restrictedProjects.map((project, index) => (
                <div 
                  key={project.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 && (
          <Card className="card-apollo text-center py-16 max-w-2xl mx-auto animate-scale-in">
            <CardHeader>
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-12 h-12 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">No Projects Available</CardTitle>
              <CardDescription className="text-lg">
                Contact your administrator to get access to projects and start exploring the Apollo Tyres ecosystem.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}