'use client';

import { useState } from 'react';
import { signUp, confirmSignUp } from '@aws-amplify/auth';
import Image from 'next/image';
import Button from './Button'; // Your custom button component
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import { useRouter } from 'next/navigation';

Amplify.configure(outputs);

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState('signUp'); // 'signUp' or 'confirm'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
             name: name,
          },
        },
      });

      if (isSignUpComplete) {
        setStage('confirmed');
        router.push('/login'); // Redirect to login
      } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setStage('confirm');
      } else {
        console.warn('Unexpected next step:', nextStep.signUpStep);
        setError('An unexpected error occurred.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error signing up:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (isSignUpComplete) {
        setStage('confirmed');
        router.push('/login'); // Redirect to login
      }
    } catch (err) {
      setError(err.message);
      console.error('Error confirming sign up:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Image
        src="/img/Fava-logo-dark.svg" // Replace with your logo path
        width={350}
        height={250}
        alt="Fava Logo"
        className="mt-[5vh]"
      />
      <div className="text-2xl font-bold">Sign Up</div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {stage === 'signUp' ? (
        <form onSubmit={handleSignUp} className="w-full mt-8 flex flex-col items-center justify-center px-10">
          <div className="mb-4 w-full md:w-[25vw]">
            <label htmlFor="name" className="block text-xs text-favaGrey">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <Button text={loading ? 'Signing Up...' : 'Sign Up'} colour="bg-favaGreen text-white" />
          </button>
        </form>
      ) : stage === 'confirm' ? (
        <form onSubmit={handleConfirm} className="w-full mt-8 flex flex-col items-center justify-center px-10">
          <div className="mb-4 w-full md:w-[25vw]">
            <label htmlFor="code" className="block text-xs text-favaGrey">
              Confirmation Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Enter your code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="mt-8">
            <Button text={loading ? 'Confirming...' : 'Confirm'} colour="bg-favaGreen text-white" />
          </button>
        </form>
      ) : (
        <p>Sign up confirmed! Redirecting to login...</p>
      )}

      <div className="mt-8 text-sm">
        Already have an account? <span className="underline cursor-pointer">Log in here</span> {/* Link to login */}
      </div>
    </div>
  );
}

export default SignUp;