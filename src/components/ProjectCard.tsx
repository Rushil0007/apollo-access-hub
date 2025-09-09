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
      <Card className={`card-apollo relative overflow-hidden group cursor-pointer ${!canAccess ? 'opacity-60' : ''}`} onClick={handleClick}>
        <CardContent className="p-6">
          {/* Lock icon for restricted projects */}
          {!canAccess && (
            <div className="absolute top-4 right-4 bg-destructive/20 p-2 rounded-full">
              <Lock className="w-4 h-4 text-destructive" />
            </div>
          )}

          {/* Project icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
            <span className="text-2xl" role="img" aria-label={project.name}>
              {project.icon}
            </span>
          </div>

          {/* Project details */}
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {canAccess ? 'Click to access' : 'Access restricted'}
            </div>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              variant={canAccess ? "default" : "secondary"}
              size="sm"
              className={`transition-all duration-300 ${
                canAccess 
                  ? 'hover:bg-secondary' 
                  : 'cursor-not-allowed'
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

          {/* Hover effect overlay */}
          {canAccess && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}
        </CardContent>
      </Card>

      {/* Access Denied Dialog */}
      <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-destructive" />
              Access Denied
            </DialogTitle>
            <DialogDescription>
              You do not have access to this project. Please contact your administrator to request access to "{project.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowAccessDialog(false)}>
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}