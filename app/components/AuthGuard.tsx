'use client'
import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isSignedIn } from '@/utils/isSignedIn'; // Import your util
import Loading from '../loading';

interface AuthGuardProps {
  children: ReactNode; // Accepts any valid React children (JSX)
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const signedIn = await isSignedIn();
      if (signedIn) {
        setIsAuthenticated(true);
      } else {
        router.replace(`/login?redirect=${pathname}`); // Store intended route
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return <Loading/>; // Placeholder UI while checking auth
  }

  return isAuthenticated ? <>{children}</> : null; // Render children if authenticated
};

export default AuthGuard;
