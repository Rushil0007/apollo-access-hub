import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ExternalLink, UserPlus, Users, Settings } from 'lucide-react';
import { Project, User } from '@/context/AuthContext';

export default function AdminPanel() {
  const { user, projects, addProject, updateProject, deleteProject, canManage, addUser, users, updateUser, deleteUser, isMajorAdmin } = useAuth();
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    url: '',
    icon: '',
    description: ''
  });

  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: 'apollo123',
    role: 'user' as 'user' | 'sub-admin',
    allowedProjects: [] as string[],
    canManageUsers: false,
    canManageProjects: false
  });

  if (!user || !canManage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You need administrator privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectFormData.name || !projectFormData.url) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingProject) {
      updateProject(editingProject.id, projectFormData);
      toast({
        title: "Project Updated",
        description: `${projectFormData.name} has been updated successfully.`,
      });
      setEditingProject(null);
    } else {
      addProject(projectFormData);
      toast({
        title: "Project Added",
        description: `${projectFormData.name} has been added successfully.`,
      });
      setIsAddProjectDialogOpen(false);
    }

    setProjectFormData({ name: '', url: '', icon: '', description: '' });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userFormData.name || !userFormData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in name and email.",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      ...userFormData,
      allowedProjects: userFormData.allowedProjects
    };

    if (editingUser) {
      updateUser(editingUser.id, userData);
      toast({
        title: "User Updated",
        description: `${userFormData.name} has been updated successfully.`,
      });
      setEditingUser(null);
    } else {
      addUser(userData);
      toast({
        title: "User Added",
        description: `${userFormData.name} has been added successfully.`,
      });
      setIsAddUserDialogOpen(false);
    }

    resetUserForm();
  };

  const handleEditProject = (project: Project) => {
    setProjectFormData({
      name: project.name,
      url: project.url,
      icon: project.icon,
      description: project.description
    });
    setEditingProject(project);
  };

  const handleEditUser = (userToEdit: User) => {
    setUserFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      password: 'apollo123',
      role: userToEdit.role === 'sub-admin' ? 'sub-admin' : 'user',
      allowedProjects: userToEdit.allowedProjects,
      canManageUsers: userToEdit.canManageUsers || false,
      canManageProjects: userToEdit.canManageProjects || false
    });
    setEditingUser(userToEdit);
  };

  const handleDeleteProject = (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      deleteProject(project.id);
      toast({
        title: "Project Deleted",
        description: `${project.name} has been removed.`,
      });
    }
  };

  const handleDeleteUser = (userToDelete: User) => {
    if (userToDelete.role === 'major-admin') {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete the major admin user.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${userToDelete.name}"?`)) {
      deleteUser(userToDelete.id);
      toast({
        title: "User Deleted",
        description: `${userToDelete.name} has been removed.`,
      });
    }
  };

  const resetProjectForm = () => {
    setProjectFormData({ name: '', url: '', icon: '', description: '' });
    setEditingProject(null);
    setIsAddProjectDialogOpen(false);
  };

  const resetUserForm = () => {
    setUserFormData({ 
      name: '', 
      email: '', 
      password: 'apollo123', 
      role: 'user',
      allowedProjects: [],
      canManageUsers: false,
      canManageProjects: false
    });
    setEditingUser(null);
    setIsAddUserDialogOpen(false);
  };

  const handleProjectCheckboxChange = (projectId: string, checked: boolean) => {
    if (checked) {
      setUserFormData(prev => ({
        ...prev,
        allowedProjects: [...prev.allowedProjects, projectId]
      }));
    } else {
      setUserFormData(prev => ({
        ...prev,
        allowedProjects: prev.allowedProjects.filter(id => id !== projectId)
      }));
    }
  };

  const regularUsers = users.filter(u => u.role !== 'major-admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage projects, users, and system configurations
            </p>
          </div>
          
          <div className="flex gap-4 animate-fade-in">
            {isMajorAdmin && (
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-apollo">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
            
            <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-apollo">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-scale-in">
          <Card className="card-apollo group">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-muted-foreground">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-1">{projects.length}</div>
              <p className="text-sm text-muted-foreground">Active in system</p>
            </CardContent>
          </Card>
          
          <Card className="card-apollo group">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-secondary mb-1">{regularUsers.length}</div>
              <p className="text-sm text-muted-foreground">Excluding major admin</p>
            </CardContent>
          </Card>

          <Card className="card-apollo group">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-muted-foreground">Sub Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600 mb-1">
                {regularUsers.filter(u => u.role === 'sub-admin').length}
              </div>
              <p className="text-sm text-muted-foreground">Administrative users</p>
            </CardContent>
          </Card>

          <Card className="card-apollo group">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-muted-foreground">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <span className="text-sm text-muted-foreground">All systems operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management - Only for Major Admin */}
        {isMajorAdmin && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Add, edit, or remove users and sub-admins
              </CardDescription>
            </CardHeader>
            <CardContent>
              {regularUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No users found</p>
                  <Button onClick={() => setIsAddUserDialogOpen(true)} className="btn-apollo">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First User
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {regularUsers.map((userItem) => (
                    <div key={userItem.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {userItem.role === 'sub-admin' ? '👨‍💼' : '👤'}
                        </div>
                        <div>
                          <h3 className="font-semibold">{userItem.name}</h3>
                          <p className="text-sm text-muted-foreground">{userItem.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={userItem.role === 'sub-admin' ? 'secondary' : 'outline'}>
                              {userItem.role === 'sub-admin' ? 'Sub Admin' : 'User'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {userItem.allowedProjects.length} projects
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(userItem)}
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(userItem)}
                          title="Delete user"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Project Management</CardTitle>
            <CardDescription>
              Add, edit, or remove projects from the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No projects found</p>
                <Button onClick={() => setIsAddProjectDialogOpen(true)} className="btn-apollo">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Project
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{project.icon}</div>
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {project.url}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(project.url, '_blank')}
                        title="Open project"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProject(project)}
                        title="Edit project"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProject(project)}
                        title="Delete project"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Project Dialog */}
        <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a new project that users can access.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={projectFormData.name}
                  onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={projectFormData.url}
                  onChange={(e) => setProjectFormData({ ...projectFormData, url: e.target.value })}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={projectFormData.icon}
                  onChange={(e) => setProjectFormData({ ...projectFormData, icon: e.target.value })}
                  placeholder="🚗"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetProjectForm}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-apollo">
                  Add Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add User Dialog - Major Admin Only */}
        {isMajorAdmin && (
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user and assign project access.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Name *</Label>
                    <Input
                      id="user-name"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                      placeholder="Enter user name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email *</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      placeholder="user@apollo.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="user"
                        checked={userFormData.role === 'user'}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'user' })}
                      />
                      <span>User</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="sub-admin"
                        checked={userFormData.role === 'sub-admin'}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'sub-admin' })}
                      />
                      <span>Sub Admin</span>
                    </label>
                  </div>
                </div>

                {userFormData.role === 'sub-admin' && (
                  <div className="space-y-2">
                    <Label>Admin Permissions</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={userFormData.canManageUsers}
                          onCheckedChange={(checked) => 
                            setUserFormData({ ...userFormData, canManageUsers: checked as boolean })
                          }
                        />
                        <span>Can manage users</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={userFormData.canManageProjects}
                          onCheckedChange={(checked) => 
                            setUserFormData({ ...userFormData, canManageProjects: checked as boolean })
                          }
                        />
                        <span>Can manage projects</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Project Access</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                    {projects.map((project) => (
                      <label key={project.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={userFormData.allowedProjects.includes(project.id)}
                          onCheckedChange={(checked) => 
                            handleProjectCheckboxChange(project.id, checked as boolean)
                          }
                        />
                        <span className="text-sm">{project.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetUserForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-apollo">
                    Add User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Project Dialog */}
        {editingProject && (
          <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>
                  Update the project information.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Project Name *</Label>
                  <Input
                    id="edit-name"
                    value={projectFormData.name}
                    onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-url">URL *</Label>
                  <Input
                    id="edit-url"
                    type="url"
                    value={projectFormData.url}
                    onChange={(e) => setProjectFormData({ ...projectFormData, url: e.target.value })}
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                  <Input
                    id="edit-icon"
                    value={projectFormData.icon}
                    onChange={(e) => setProjectFormData({ ...projectFormData, icon: e.target.value })}
                    placeholder="🚗"
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                    placeholder="Brief description of the project"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetProjectForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-apollo">
                    Update Project
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit User Dialog - Major Admin Only */}
        {isMajorAdmin && editingUser && (
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user information and project access.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-name">Name *</Label>
                    <Input
                      id="edit-user-name"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                      placeholder="Enter user name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-user-email">Email *</Label>
                    <Input
                      id="edit-user-email"
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      placeholder="user@apollo.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="user"
                        checked={userFormData.role === 'user'}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'user' })}
                      />
                      <span>User</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="sub-admin"
                        checked={userFormData.role === 'sub-admin'}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'sub-admin' })}
                      />
                      <span>Sub Admin</span>
                    </label>
                  </div>
                </div>

                {userFormData.role === 'sub-admin' && (
                  <div className="space-y-2">
                    <Label>Admin Permissions</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={userFormData.canManageUsers}
                          onCheckedChange={(checked) => 
                            setUserFormData({ ...userFormData, canManageUsers: checked as boolean })
                          }
                        />
                        <span>Can manage users</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={userFormData.canManageProjects}
                          onCheckedChange={(checked) => 
                            setUserFormData({ ...userFormData, canManageProjects: checked as boolean })
                          }
                        />
                        <span>Can manage projects</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Project Access</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                    {projects.map((project) => (
                      <label key={project.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={userFormData.allowedProjects.includes(project.id)}
                          onCheckedChange={(checked) => 
                            handleProjectCheckboxChange(project.id, checked as boolean)
                          }
                        />
                        <span className="text-sm">{project.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetUserForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-apollo">
                    Update User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
