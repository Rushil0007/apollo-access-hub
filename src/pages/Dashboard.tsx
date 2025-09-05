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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-muted-foreground">
            Access your Apollo Tyres projects and tools
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
              {user.role === 'admin' ? 'Administrator' : 'User'}
            </Badge>
            <Badge variant="outline">
              {accessibleProjects.length} of {projects.length} projects accessible
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accessible Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{accessibleProjects.length}</div>
              <p className="text-xs text-muted-foreground">
                Out of {projects.length} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Role</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {user.role === 'admin' ? 'Admin' : 'User'}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.role === 'admin' ? 'Full system access' : 'Limited access'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Level</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">High</div>
              <p className="text-xs text-muted-foreground">
                Enterprise grade security
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Access</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <p className="text-xs text-muted-foreground">
                Available worldwide
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Accessible Projects */}
        {accessibleProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Your Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {accessibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Restricted Projects (if any) */}
        {restrictedProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Restricted Projects
            </h2>
            <p className="text-muted-foreground mb-4">
              The following projects require additional access permissions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restrictedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 && (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No Projects Available</CardTitle>
              <CardDescription>
                Contact your administrator to get access to projects.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}