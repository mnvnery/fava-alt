'use client'
import Image from 'next/image';
import Button from './Button'
import { assignTestKit } from '@/utils/assignTestKit';
import { getSignedUser } from '@/utils/getSignedUser';
import { useEffect, useState } from 'react';
import { fetchUserTestKit } from '@/utils/fetchUserTestKit';
import { useRouter } from 'next/navigation';
import Loading from '../loading';

interface User { 
    id: string;
}


const KitConnection = () => {
    const [user, setUser] = useState<User | null>(null);
    const [kitId, setKitId] = useState("");
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function checkUser() {
            try {
                const signedUser = await getSignedUser();
                if (!signedUser) {
                    router.push('/login'); // Redirect if not signed in
                    return;
                }

                setUser(signedUser);

                // Check if user already has a test kit
                const userTestKit = await fetchUserTestKit(signedUser.id);
                if (userTestKit) {
                    const date = new Date(userTestKit.createdAt);
                    date.setMonth(date.getMonth() + 1);
                    const formattedDate = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });

                    router.push(`/testKit/complete?date=${formattedDate}`); // Redirect if test kit already assigned
                    return;
                }
            } catch (error) {
                console.error("Error checking user or test kit:", error);
            } finally {
                setLoading(false); // Stop loading once checks are done
            }
        }

        checkUser();
    }, [router]);

    const handleTest = async () => {
        if (!user?.id) {
            console.error("User ID is missing.");
            alert("Please sign in or wait for user data to load.");
            return;
        }
    
        try {
            await assignTestKit(user.id, kitId);
            router.push('/testKit/instructions');
            } catch (error) {
            console.error("Failed to update user data:", error);
        }
    };

    if (loading) {
        return (
                <Loading/>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-[80dvh] text-center px-12">
            <div className="text-2xl font-bold">Let’s connect your test kit to your account.</div>
            <div className="mt-6 text-base text-center">
                Please enter your test kit’s ID number. <br/>
                You can find the ID on [xxxx]
            </div>
            <Image 
                src={"/img/id-illus.jpg"}
                width={250}
                height={100}
                alt="Fava Logo"
                className="mt-8"
            />
            <input
              type="text"
              id="test-kit-id"
              name="test-kit-id"
              value={kitId}
              onChange={(e) => setKitId(e.target.value)}
              className="mt-9 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean md:w-[25vw]"
              placeholder="Test Kit ID"
              required
            />
            <div className="flex space-x-6 mt-14">
                <Button text="Submit" colour="bg-favaGreen text-white" onClick={handleTest} />
            </div>
        </div>
    );
}

export default KitConnection;