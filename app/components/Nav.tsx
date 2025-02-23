'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { signOut, deleteUser } from "aws-amplify/auth";
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import { isSignedIn } from "@/utils/isSignedIn";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react"
import Button from "./Button";

Amplify.configure(outputs, { ssr: true });

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
{/*
  const handleDelete = async () => {
    try {
      await deleteUser();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
 */}


  return (
    <div className={`flex justify-between items-center py-3 px-4`}>
      <Image
        src={"/img/Fava-logo-horizontal-dark.svg"}
        width={80}
        height={50}
        alt="Fava Logo"
      />
      <div className="flex items-center">
        <button onClick={handleClick} className="flex flex-col justify-center items-center z-50 relative ml-4">
          <span className={`bg-favaGreen block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}></span>
          <span className={`bg-favaGreen block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`bg-favaGreen block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}></span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="absolute top-0 right-0 h-dvh bg-white rounded-l-xl w-[72vw] md:w-[25vw] z-30 flex flex-col px-8 pt-[10vh] shadow-lg"
            >
              <Link className="border-t border-favaBean py-5 font-semibold px-2" href="/order">My order</Link>
              <Link className="border-t border-favaBean py-5 font-semibold px-2" href="/testKit">Register your Kit</Link>
              <Link className="border-t border-favaBean py-5 font-semibold px-2" href="https://www.favahealth.com/">About Fava</Link>
              <Link className="border-t border-favaBean py-5 font-semibold px-2" href="https://www.favahealth.com/contact-us">Contact Us</Link>
              <div className="flex-1 flex items-end mb-12">
              {isUserSignedIn ? (
                <>
                <Button onClick={handleSignOut} text="Sign Out" colour="w-full h-fit text-center bg-favaGreen text-white"/>
                {/*<Button onClick={handleDelete} text="Delete" colour="w-full h-fit text-center bg-favaBean text-favaGreen"/>*/}
                </>
              ) : (
                <Button onClick={() => router.push('/login')} text="Sign In" colour="w-full h-fit text-center bg-favaBean text-favaGreen"/>
              )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Nav;