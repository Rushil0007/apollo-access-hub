import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  allowedProjects: string[];
}

interface AuthContextType {
  user: User | null;
  projects: Project[];
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateUserAccess: (userId: string, projectIds: string[]) => void;
  hasAccess: (projectId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Apollo Connect',
    url: 'https://apollo-connect.example.com',
    icon: '🚗',
    description: 'Connected vehicle platform'
  },
  {
    id: '2',
    name: 'Tyre Analytics',
    url: 'https://analytics.apollo.example.com',
    icon: '📊',
    description: 'Advanced tyre performance analytics'
  },
  {
    id: '3',
    name: 'Fleet Management',
    url: 'https://fleet.apollo.example.com',
    icon: '🚛',
    description: 'Commercial fleet solutions'
  },
  {
    id: '4',
    name: 'R&D Portal',
    url: 'https://research.apollo.example.com',
    icon: '🔬',
    description: 'Research and development hub'
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@apollo.com',
    role: 'admin',
    allowedProjects: ['1', '2', '3', '4']
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@apollo.com',
    role: 'user',
    allowedProjects: ['1', '2']
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'apollo123') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const updateUserAccess = (userId: string, projectIds: string[]) => {
    if (user && user.id === userId) {
      setUser({ ...user, allowedProjects: projectIds });
    }
  };

  const hasAccess = (projectId: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.allowedProjects.includes(projectId);
  };

  const value: AuthContextType = {
    user,
    projects,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    addProject,
    updateProject,
    deleteProject,
    updateUserAccess,
    hasAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}