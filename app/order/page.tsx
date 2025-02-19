'use client'
import Nav from '../components/Nav'
import Questionaire from '../components/Questionaire'
import KitCheck from '../components/KitCheck'
import TestKitOrder from '../components/TestKitOrder'
import AuthGuard from '../components/AuthGuard';
import { getSignedUser } from '@/utils/getSignedUser';
import { updateUser } from '@/utils/updateUser';
import { useState, useEffect } from 'react';
import TitleTextBtn from '../components/TitleTextBtn'
import Loading from '../loading'
import OrderStatus from '../components/OrderStatus'

interface User { 
    id: string;
    favaId: string | null;
    name: string | null;
    email: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    county: string | null;
    postcode: string | null;
    dob: string | null;
    sex: string | null;
    gender: string | null;
    ethnicGroup: string | null;
    conditions: string | null;
    takesMedicines: boolean | null;
    medicines: string | null;
    medicineIssues: string | null;
    inviteToken: string | null;
    inPerson: boolean | null;
    status: string | null;
}


export default function Order() {
    const [user, setUser] = useState<User | null>(null);

    // console.log(user)
    useEffect(() => {
        async function checkUser() {
          const signedUser = await getSignedUser();
          setUser(signedUser);
        }
        checkUser();
    }, []);


    const updateUserData = async (updates: Partial<User>) => {
        if (!user?.id) {
            console.error("User ID is missing.");
            alert("Please sign in or wait for user data to load.");
            return;
        }
    
        try {
            await updateUser(user.id, updates);
    
            setUser((prevUser) => prevUser ? { ...prevUser, ...updates } : prevUser);
        } catch (error) {
            console.error("Failed to update user data:", error);
        }
    };

      const renderStage = () => {
        if (!user) return <Loading/>;

        switch (user.status) {
            case "Kit Check":
                return (
                    <KitCheck 
                        onClickHome={() => updateUserData({ status: "Order Home Kit", inPerson: false})}
                        onClickInPerson={() => updateUserData({ status: "In Person - Ready", inPerson: true})}
                    />
                );
            case "Order Home Kit":
                return (
                    <TestKitOrder 
                        onClick={() => updateUserData({ status: "Home Kit Ordered"})} 
                        userId={user.id} 
                        name={user.name ?? ""}
                    />
                );
            case "Home Kit Ordered":
                return (
                    <TitleTextBtn 
                        btnOnClick={() => updateUserData({ status: "Completing Questionaire"})}
                        title="Thank you, your test kit is on its way." 
                        btnColour="bg-favaGreen text-white" 
                        btnText="Ask away"
                    >
                        Whilst you wait for your kit to arrive, answer a few questions that will help us personalise your results to you.
                    </TitleTextBtn>
                );
            case "In Person - Ready":
                return (
                    <TitleTextBtn 
                        btnOnClick={() => updateUserData({ status: "Completing Questionaire"})}
                        title="Excellent, you’re ready to go." 
                        btnColour="bg-favaGreen text-white" 
                        btnText="Ask away"
                    >
                        Before you take your test, answer a few questions that will help us personalise your results to you.
                    </TitleTextBtn>
                );
            case "Completing Questionaire":
                return (
                    <Questionaire 
                        btnOnClick={() => updateUserData({ status: "Questionaire Complete"})}
                        userId={user.id}
                    />
                );
            case "Questionaire Complete":
                return (
                    <div className="flex flex-col justify-center items-center w-full h-[80dvh] text-center px-12">
                        <div className="text-2xl font-bold">
                            Your order has been received and your test kit will be on its way shortly.
                            <br /><br />
                            Please come back here once you have received your kit.
                        </div>
                    </div>
                );
            case "Posted Kit":
                return (
                    <OrderStatus userStatus={user.status}/>
                );
            default:
                return <Loading/>;
        }
    };
    return (    
        <AuthGuard>
            <Nav/>
            {renderStage()}
            {/*<button className="p-5" onClick={() => updateUserData({ status: "Kit Check"})}>Update Status</button>*/}
        </AuthGuard>
    );
}