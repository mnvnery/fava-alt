'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { signOut, getCurrentUser, fetchAuthSession, fetchUserAttributes } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function Nav({}) {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null); // Add session state
    const [userAttributes, setUserAttributes] = useState(null)
    const router = useRouter();


    useEffect(() => {
        const checkUserAndSession = async () => {
            try {
                const authUser = await getCurrentUser(); // Use getCurrentUser
                setUser(authUser);
    
                const userAttributes = await fetchUserAttributes();
                setUserAttributes(userAttributes)

                const authSession = await fetchAuthSession(); // Fetch session
                setSession(authSession);
    
                //console.log("User:", authUser);
                // console.log("Session:", authSession); // Log the session
                //console.log("User Attributes", userAttributes)
                // Access tokens:
                //console.log("Access Token:", authSession.tokens.accessToken.jwtToken);
                //console.log("ID Token:", authSession.tokens.idToken.jwtToken);
    
            } catch (error) {
                setUser(null);
                setSession(null); // Clear session state as well
                console.log("No user or session found", error);
            }
        };

        checkUserAndSession(); // Call combined function


    }, []); // Add checkUserAndSession to the dependency array    

    //console.log(session)

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
            setSession(null); // Clear session on sign-out
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // console.log(user)
    return (
        <div className={`flex justify-between items-center py-3 px-4`}>
            <Image 
                src={"/img/Fava-logo-horizontal-dark.svg"} // Replace with your logo path
                width={80}
                height={50}
                alt="Fava Logo"
                className=""
            />
            <div className="flex items-center">
                {user && session ? (
                    <div className="flex items-center space-x-4">
                        
                        <div>
                           {userAttributes && userAttributes?.name && (
                                <span className="text-sm">{userAttributes.name}</span> // Default to username
                            )}
                        </div>
                        
                        <button onClick={handleSignOut} className="text-sm underline">
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <button onClick={() => router.push('/login')} className="text-sm underline">
                        Login
                    </button>
                )}
                <button
                    onClick={handleClick}
                    className="flex flex-col justify-center items-center z-50 relative ml-4"
                >
                    <span className={`bg-favaGreen block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}></span>
                    <span className={`bg-favaGreen block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
                    <span className={`bg-favaGreen block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}></span>
                </button>
            </div>
        </div>
    );
}