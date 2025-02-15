'use client'
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';

interface AuthGuardProps {
  children: ReactNode; // Accepts any valid React children (JSX)
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser(); // Try to fetch the current user
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error); // Log the error
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <p className='p-4'>Loading...</p>; // Placeholder UI while checking auth
  }

  return isAuthenticated ? <>{children}</> : null; // Render children if authenticated
};

export default AuthGuard;
