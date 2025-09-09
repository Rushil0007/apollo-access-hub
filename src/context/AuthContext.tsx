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
  role: 'major-admin' | 'sub-admin' | 'user';
  allowedProjects: string[];
  canManageUsers?: boolean;
  canManageProjects?: boolean;
}

interface AuthContextType {
  user: User | null;
  projects: Project[];
  users: User[];
  isMajorAdmin: boolean;
  isSubAdmin: boolean;
  canManage: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
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
    name: 'Major Admin',
    email: 'major@apollo.com',
    role: 'major-admin',
    allowedProjects: ['1', '2', '3', '4'],
    canManageUsers: true,
    canManageProjects: true
  },
  {
    id: '2',
    name: 'Sub Admin',
    email: 'subadmin@apollo.com',
    role: 'sub-admin',
    allowedProjects: ['1', '2'],
    canManageUsers: true,
    canManageProjects: true
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@apollo.com',
    role: 'user',
    allowedProjects: ['1']
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email === email);
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

  const addUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString()
    };
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (user && user.id === id) {
      setUser({ ...user, ...updates });
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const hasAccess = (projectId: string): boolean => {
    if (!user) return false;
    if (user.role === 'major-admin') return true;
    if (user.role === 'sub-admin' && user.canManageProjects) return true;
    return user.allowedProjects.includes(projectId);
  };

  const value: AuthContextType = {
    user,
    projects,
    users,
    isMajorAdmin: user?.role === 'major-admin',
    isSubAdmin: user?.role === 'sub-admin',
    canManage: user?.role === 'major-admin' || (user?.role === 'sub-admin' && (user?.canManageUsers || user?.canManageProjects)),
    login,
    logout,
    addProject,
    updateProject,
    deleteProject,
    addUser,
    updateUser,
    deleteUser,
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