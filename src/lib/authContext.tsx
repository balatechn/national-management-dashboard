import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user roles
export enum UserRole {
  VIEWER = 'viewer',
  INTERACTIVE = 'interactive', 
  ADMIN = 'admin'
}

// Define user interface
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}

// Define permissions for each role
export interface RolePermissions {
  canView: boolean;
  canInteract: boolean;
  canEdit: boolean;
  canUpload: boolean;
  canDrillDown: boolean;
}

// Permission mapping
const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  [UserRole.VIEWER]: {
    canView: true,
    canInteract: false,
    canEdit: false,
    canUpload: false,
    canDrillDown: false
  },
  [UserRole.INTERACTIVE]: {
    canView: true,
    canInteract: true,
    canEdit: false,
    canUpload: false,
    canDrillDown: true
  },
  [UserRole.ADMIN]: {
    canView: true,
    canInteract: true,
    canEdit: true,
    canUpload: true,
    canDrillDown: true
  }
};

// Auth context interface
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  permissions: RolePermissions;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  isLoading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database - In production, this would be replaced with actual API calls
const MOCK_USERS = [
  {
    id: '1',
    username: 'viewer',
    password: 'viewer123',
    email: 'viewer@national.com',
    role: UserRole.VIEWER
  },
  {
    id: '2', 
    username: 'manager',
    password: 'manager123',
    email: 'manager@national.com',
    role: UserRole.INTERACTIVE
  },
  {
    id: '3',
    username: 'admin',
    password: 'admin123', 
    email: 'admin@national.com',
    role: UserRole.ADMIN
  }
];

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('dashboardUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('dashboardUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const userObj: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        isAuthenticated: true
      };
      
      setUser(userObj);
      localStorage.setItem('dashboardUser', JSON.stringify(userObj));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('dashboardUser');
  };

  // Get permissions for current user
  const permissions: RolePermissions = user 
    ? ROLE_PERMISSIONS[user.role]
    : {
        canView: false,
        canInteract: false,
        canEdit: false,
        canUpload: false,
        canDrillDown: false
      };

  // Check specific permission
  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    permissions,
    hasPermission,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission?: keyof RolePermissions
) => {
  return (props: P) => {
    const { user, hasPermission, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user?.isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this feature.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};
