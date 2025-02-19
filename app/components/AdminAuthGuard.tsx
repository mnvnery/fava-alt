'use client'

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

import Loading from '../loading';

interface AdminAuthGuardProps {
  children: ReactNode; // Accepts any valid React children (JSX)
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser(); // Fetch the current user
        if (!user) {
          throw new Error("User not authenticated");
        }

        const session = await fetchAuthSession(); // Get the current session
        const groups = session.tokens?.accessToken.payload['cognito:groups'] || [];

        console.log('User groups:', groups);

        if (Array.isArray(groups) && groups.includes("Admin")) {
          setIsAdmin(true); // User is an admin
        } else {
          throw new Error("User does not have admin rights");
        }
      } catch (error) {
        console.error("Authentication or authorization error:", error); // Log the error
        if (error instanceof Error) {
          setError(error.message || "An error occurred while checking user authentication");
        }
        router.push('/login'); // Redirect to login page
      } finally {
        setLoading(false); // Set loading to false after checking auth
      }
    };

    checkAuth();
  }, [router]);

  // Display loading state while checking auth
  if (loading) {
    return <Loading />;
  }

  // If there's an error, you might want to show a message before redirecting
  if (error) {
    return <div>Error: {error}</div>; // Display error message if any
  }

  // Render children only if the user is an admin
  return isAdmin ? <>{children}</> : null; // If not admin, return null (or show an "Access Denied" message)
};

export default AdminAuthGuard;
