import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Lock } from 'lucide-react';
import { Project } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { hasAccess } = useAuth();
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const canAccess = hasAccess(project.id);

  const handleClick = () => {
    if (!canAccess) {
      setShowAccessDialog(true);
      return;
    }
    
    // Open in new tab
    window.open(project.url, '_blank');
    
    toast({
      title: "Redirecting...",
      description: `Opening ${project.name}`,
    });
  };

  return (
    <>
      <Card 
        className={`card-project group transition-all duration-500 ${!canAccess ? 'opacity-60' : ''}`} 
        onClick={handleClick}
      >
        <CardContent className="relative p-8">
          {/* Lock icon for restricted projects */}
          {!canAccess && (
            <div className="absolute top-6 right-6 bg-destructive/10 border border-destructive/20 p-3 rounded-full">
              <Lock className="w-5 h-5 text-destructive" />
            </div>
          )}

          {/* Project icon */}
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mb-6 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-500 group-hover:scale-110">
            <span className="text-3xl" role="img" aria-label={project.name}>
              {project.icon}
            </span>
          </div>

          {/* Project details */}
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            {project.name}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              {canAccess ? 'Click to access' : 'Access restricted'}
            </div>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              variant={canAccess ? "default" : "secondary"}
              size="sm"
              className={`transition-all duration-300 rounded-lg px-4 py-2 ${
                canAccess 
                  ? 'btn-apollo' 
                  : 'cursor-not-allowed bg-muted text-muted-foreground'
              }`}
              disabled={!canAccess}
            >
              {canAccess ? (
                <>
                  Open
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Locked
                  <Lock className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Premium hover effect */}
          {canAccess && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
          )}
          
          {/* Subtle border glow on hover */}
          {canAccess && (
            <div className="absolute inset-0 border border-transparent group-hover:border-primary/20 rounded-2xl transition-all duration-500" />
          )}
        </CardContent>
      </Card>

      {/* Access Denied Dialog */}
      <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <DialogContent className="max-w-md bg-white border-2 border-primary/20 shadow-2xl">
          <DialogHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-destructive">
              Access Denied
            </DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground leading-relaxed">
              You do not have access to <span className="font-semibold text-primary">"{project.name}"</span>. 
              Please contact your administrator to request access.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-6">
            <Button 
              onClick={() => setShowAccessDialog(false)}
              className="btn-apollo px-8"
            >
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}