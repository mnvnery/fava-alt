'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { signOut } from "aws-amplify/auth";
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import { isSignedIn } from "@/utils/isSignedIn";

Amplify.configure(outputs);


const Nav = () => { // No props in this component
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>(false);

  useEffect(() => {
    async function checkAuth() {
      const signedIn = await isSignedIn();
      setIsUserSignedIn(signedIn);
    }
    checkAuth();
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`flex justify-between items-center py-3 px-4`}>
      <Image
        src={"/img/Fava-logo-horizontal-dark.svg"}
        width={80}
        height={50}
        alt="Fava Logo"
      />
      <div className="flex items-center">
        {isUserSignedIn ? (
          <button onClick={handleSignOut} className="text-sm underline">
            Sign Out
          </button>
        ) : (
          <button onClick={() => router.push('/login')} className="text-sm underline">
            Sign In
          </button>
        )}
        <button onClick={handleClick} className="flex flex-col justify-center items-center z-50 relative ml-4">
          <span className={`bg-favaGreen block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}></span>
          <span className={`bg-favaGreen block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`bg-favaGreen block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}></span>
        </button>
      </div>
    </div>
  );
};

export default Nav;