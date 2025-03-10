'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signUp, confirmSignUp, autoSignIn, signOut } from '@aws-amplify/auth';
import { generateClient } from "aws-amplify/data";
import Image from 'next/image';
import Button from './Button';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import type { Schema } from "@/amplify/data/resource";
import { updateUser } from '@/utils/updateUser';
import Loading from '../loading';
import { isSignedIn } from "@/utils/isSignedIn";


Amplify.configure(outputs, { ssr: true });const client = generateClient<Schema>({ authMode: "apiKey" }); // Using API Key

function TokenSignUp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const inviteToken = searchParams.get('token'); // Extract token from URL
  const [user, setUser] = useState<Schema["User"]["type"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'signUp' | 'confirm' | 'confirmed'>('signUp');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    async function checkAuth() {
      const signedIn = await isSignedIn();

      if (signedIn) {
        const proceed = confirm("You're already signed in. Would you like to sign out and continue with this sign-up process?");
        if (proceed) {
          await signOut();
        } else {
          router.push('/order'); // Or wherever the user should go if they stay logged in
        }
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!inviteToken) {
      setError("Invalid or missing invite link.");
      return;
    }

    async function fetchUser() {
      try {
        const result = await client.models.User.list({
          filter: { inviteToken: { eq: inviteToken ?? undefined } }, 
        });

        if (result.data.length === 0) {
          setError("Invalid or expired invite token.");
          return;
        }

        setUser(result.data[0]); // Set user data
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Something went wrong. Please try again.");
      }
    }

    fetchUser();
  }, [inviteToken]);

  //console.log(user)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: user?.email ?? "",
        password,
        options: {
          userAttributes: {
            name: user?.name ?? "",
            'custom:user_id': user?.id
          },
          autoSignIn: true
        },
      });

      if (isSignUpComplete) {
        setStage('confirmed');
      } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setStage('confirm');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError("An unknown error occurred");
      }
      console.error("Sign-up error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const { nextStep } = await confirmSignUp({
        username: user?.email ?? "",
        confirmationCode: code,
      });
  
      if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
        // Call autoSignIn only if this step is returned
        try {
          const { nextStep: autoSignInStep } = await autoSignIn();
  
          if (autoSignInStep.signInStep === 'DONE') {
            console.log('Successfully signed in.');
            if (user?.id) {
              await updateUser(user.id, { status: "Kit Check" });
              setUser((prevUser) => prevUser ? { ...prevUser, status: "Kit Check" } : prevUser);
            }
            router.push('/order'); // Redirect to the order page
          } else {
            console.warn('Unexpected next step in autoSignIn:', autoSignInStep.signInStep);
            //router.push('/login'); // Fallback to login if auto sign-in fails
          }
        } catch (autoSignInError) {
          console.error('Auto sign-in failed:', autoSignInError);
          setError("Auto sign-in failed. Please log in manually.");
          //router.push('/login'); // Redirect to login if auto sign-in fails
        }
      } else {
        // If auto sign-in step isn't returned, manually redirect to login
        setStage('confirmed');
        router.push('/login');
        if (user?.id) {
          await updateUser(user.id, { status: "Kit Check" });
          setUser((prevUser) => prevUser ? { ...prevUser, status: "Kit Check" } : prevUser);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error confirming sign-up:", err);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
      errors: [
        !minLength && "At least 8 characters",
        !hasUppercase && "At least one uppercase letter",
        !hasNumber && "At least one number",
        !hasSpecialChar && "At least one special character"
      ].filter(Boolean), // Remove false values
    };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    const validation = validatePassword(e.target.value);
    setPasswordErrors(validation.errors.filter(Boolean) as string[]); // Type assertion
  };
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Image src="/img/Fava-logo-dark.svg" width={350} height={250} alt="Fava Logo" className="mt-[5vh]" />
      <div className="text-2xl font-bold">Sign Up</div>

      {error ? (
        <div className="mt-4 text-center">
          <p className="text-red-500 mb-10">{error}</p>
          {error.includes("already exists") && (
            <Button
              onClick={() => router.push('/login')}
              text="Login"
              colour="bg-favaGreen text-white"
            />
          )}
        </div>
      ) : user ? (
        stage === 'signUp' ? (
          <form onSubmit={handleSignUp} className="w-full mt-8 flex flex-col items-center justify-center px-10">
            <div className="mb-4 w-full md:w-[25vw]">
              <label className="block text-xs text-favaGrey">Name</label>
              <input type="text" className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md" value={user?.name ?? ""} disabled />
            </div>
            <div className="mb-4 w-full md:w-[25vw]">
              <label className="block text-xs text-favaGrey">Email</label>
              <input type="email" className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md" value={user?.email ?? ""} disabled />
            </div>
            <div className="mb-6 w-full md:w-[25vw]">
              <label className="block text-xs text-favaGrey">Password</label>
              <input
                type="password"
                className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {passwordErrors.length > 0 && (
                <ul className="text-xs text-red-500 mt-1.5">
                  {passwordErrors.map((err, index) => (
                    <li key={index}>• {err}</li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit" disabled={loading} className="mt-8">
              <Button text={loading ? 'Signing Up...' : 'Sign Up'} colour="bg-favaGreen text-white" onClick={undefined} />
            </button>
          </form>
        ) : stage === 'confirm' ? (
          <form onSubmit={handleConfirm} className="w-full mt-8 flex flex-col items-center justify-center px-10">
            <div className="mb-4 w-full md:w-[25vw]">
              <label className="block text-xs text-favaGrey">Confirmation Code</label>
              <input type="text" className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md" placeholder="Enter your code" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="mt-8">
              <Button text={loading ? 'Confirming...' : 'Confirm'} colour="bg-favaGreen text-white" onClick={undefined} />
            </button>
          </form>
        ) : (
          <p>Sign up confirmed! Redirecting to login...</p>
        )
      ) : (
        
        <Loading/>
      )}
    </div>
  );
}

export default TokenSignUp;
