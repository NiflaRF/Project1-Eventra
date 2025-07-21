
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role:
    | 'student'
    | 'faculty'
    | 'service-provider'
    | 'admin'
    | 'super-admin'
    | 'vice-chancellor'
    | 'administration'
    | 'student-union'
    | 'warden';
  serviceType?: 'Sound System' | 'Media'; // Only for service-provider
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'admin@university.edu', role: 'admin' },
  { id: '10', name: 'Super Admin', email: 'superadmin@university.edu', role: 'super-admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@university.edu', role: 'student' },
  { id: '3', name: 'Prof. Wilson', email: 'wilson@university.edu', role: 'faculty' },
  { id: '4', name: 'SoundPro', email: 'serviceprovider@university.edu', role: 'service-provider', serviceType: 'Sound System' },
  { id: '5', name: 'MediaPro', email: 'mediaprovider@university.edu', role: 'service-provider', serviceType: 'Media' },
  { id: '6', name: 'VC User', email: 'vc@university.edu', role: 'vice-chancellor' },
  { id: '7', name: 'Admin Office', email: 'adminoffice@university.edu', role: 'administration' },
  { id: '8', name: 'Student Union', email: 'studentunion@university.edu', role: 'student-union' },
  { id: '9', name: 'Warden', email: 'warden@university.edu', role: 'warden' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('eventra_user');
    console.log('Checking stored user:', storedUser);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Found stored user:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('eventra_user');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    console.log('AuthContext: Login attempt for:', { email, role, password: password ? 'provided' : 'missing' });
    console.log('Available mock users:', mockUsers);
    // Mock authentication - in real app, this would be an API call
    let foundUser = mockUsers.find(u => {
      console.log('Checking user:', u.email, 'against:', email, 'role:', u.role, 'against:', role);
      return u.email === email && u.role === role;
    });
    // If registering a new service provider, assign a default serviceType if not present
    if (foundUser && foundUser.role === 'service-provider' && !foundUser.serviceType) {
      foundUser = { ...foundUser, serviceType: 'Sound System' };
    }
    console.log('Found user:', foundUser);
    if (foundUser && password === 'password123') { // Simple mock password
      console.log('Authentication successful');
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('eventra_user', JSON.stringify(foundUser));
      return true;
    }
    console.log('Authentication failed');
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    console.log('AuthContext: Registration attempt for:', userData);
    // Mock registration - in real app, this would be an API call
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role as User['role'],
      serviceType: userData.role === 'service-provider' ? 'Sound System' : undefined // Default for demo
    };
    // Add to mock users (in real app, this would be saved to database)
    mockUsers.push(newUser);
    console.log('User registered successfully:', newUser);
    return true;
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('eventra_user');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
