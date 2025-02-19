'use client';

import { useState } from 'react';
import { signIn } from '@aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation'; // Use searchParams
import Image from 'next/image';
import Button from './Button';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import Link from 'next/link';

Amplify.configure(outputs);

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query params

  // Get redirect path from URL (fallback to /order if not provided)
  const redirectTo = searchParams.get('redirect') || '/order';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn({ username: email, password });
      console.log('Successful sign-in');
      router.push(redirectTo); // Redirect to stored path
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Error signing in:', err.message);
      } else {
        setError('An unknown error occurred');
        console.error('Unknown error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Image
        src="/img/Fava-logo-dark.svg"
        width={350}
        height={250}
        alt="Fava Logo"
        className="mt-[5vh]"
      />
      <div className="text-2xl font-bold">Sign In</div>

      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="w-full mt-8 flex flex-col items-center justify-center px-10">
        <div className="mb-4 w-full md:w-[25vw]">
          <label htmlFor="email" className="block text-xs text-favaGrey">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6 w-full md:w-[25vw]">
          <label htmlFor="password" className="block text-xs text-favaGrey">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="mt-8">
          <Button onClick={undefined} text={loading ? 'Signing In...' : 'Sign In'} colour="bg-favaGreen text-white" />
        </button>
      </form>

      <Link href="/reset">
        <div className="mt-8 text-sm hover:underline pointer-cursor">
          Forgot your password?
        </div>
      </Link>
    </div>
  );
}

export default SignIn;
