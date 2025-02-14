'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signUp, confirmSignUp, autoSignIn } from '@aws-amplify/auth';
import { generateClient } from "aws-amplify/data";
import Image from 'next/image';
import Button from './Button';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);
const client = generateClient<Schema>({ authMode: "apiKey" }); // Using API Key

function TokenSignUp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const inviteToken = searchParams.get('token'); // Extract token from URL
  const [user, setUser] = useState<Schema["Users"]["type"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'signUp' | 'confirm' | 'confirmed'>('signUp');

  useEffect(() => {
    if (!inviteToken) {
      setError("Invalid or missing invite link.");
      return;
    }

    async function fetchUser() {
      try {
        const result = await client.models.Users.list({
          filter: { inviteToken: { eq: inviteToken } }, // Find user by token
        });

        console.log(result.data)

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: user!.email,
        password,
        options: {
          userAttributes: {
            name: user!.name,
          },
        },
      });

      if (isSignUpComplete) {
        setStage('confirmed');
        router.push('/login');
      } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setStage('confirm');
      }
    } catch (err: any) {
      setError(err.message);
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
      const { isSignUpComplete } = await confirmSignUp({
        username: user!.email,
        confirmationCode: code,
      });
  
      if (isSignUpComplete) {
        setStage('confirmed');
  
        // Attempt auto sign-in
        try {
          const { nextStep } = await autoSignIn();
  
          if (nextStep.signInStep === 'DONE') {
            console.log('Successfully signed in.');
            router.push('/dashboard'); // Redirect to the dashboard or another protected page
          } else {
            console.warn('Unexpected next step in autoSignIn:', nextStep.signInStep);
            router.push('/login'); // Fallback to login if auto sign-in fails
          }
        } catch (autoSignInError) {
          console.error('Auto sign-in failed:', autoSignInError);
          setError("Auto sign-in failed. Please log in manually.");
          router.push('/login'); // Redirect to login if auto sign-in fails
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error confirming sign-up:", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Image src="/img/Fava-logo-dark.svg" width={350} height={250} alt="Fava Logo" className="mt-[5vh]" />
      <div className="text-xl font-bold">Sign Up</div>

      {error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : user ? (
        stage === 'signUp' ? (
          <form onSubmit={handleSignUp} className="w-full mt-8 flex flex-col items-center justify-center px-10">
            <div className="mb-4 w-full md:w-[25vw]">
              <label className="block text-xs text-favaGrey">Name</label>
              <input type="text" className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md" value={user.name} disabled />
            </div>
            <div className="mb-4 w-full md:w-[25vw]">
              <label className="block text-xs text-favaGrey">Email</label>
              <input type="email" className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md" value={user.email} disabled />
            </div>
            <div className="mb-6 w-full md:w-[25vw]">
              <label className="block text-xs text-favaGrey">Password</label>
              <input type="password" className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="mt-8">
              <Button text={loading ? 'Signing Up...' : 'Sign Up'} colour="bg-favaGreen text-white" />
            </button>
          </form>
        ) : stage === 'confirm' ? (
          <form onSubmit={handleConfirm} className="w-full mt-8 flex flex-col items-center justify-center px-10">
            <div className="mb-4 w-full md:w-[25vw]">
              <label className="block text-xs text-favaGrey">Confirmation Code</label>
              <input type="text" className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md" placeholder="Enter your code" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="mt-8">
              <Button text={loading ? 'Confirming...' : 'Confirm'} colour="bg-favaGreen text-white" />
            </button>
          </form>
        ) : (
          <p>Sign up confirmed! Redirecting to login...</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TokenSignUp;
