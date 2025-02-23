'use client'
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import Button from "../components/Button";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"; // Ensure this file exists
import type { Schema } from "@/amplify/data/resource";
import AdminAuthGuard from "../components/AdminAuthGuard";

// ✅ Ensure Amplify is configured before using generateClient
Amplify.configure(outputs, { ssr: true });// Amplify Client
const client = generateClient<Schema>({
    authMode: "apiKey"
});

export default function InviteUser() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [users, setUsers] = useState<Array<Schema["User"]["type"]>>([]);


    function listUsers() {
        client.models.User.observeQuery().subscribe({
          next: (data) => setUsers([...data.items]),
        });
      }

    useEffect(() => {
        listUsers();
    }, []);

    // Invite user function
    async function handleInvite() {
        const response = await fetch("/api/send-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name }),
        });

        const data = await response.json();
        alert(data.message);

        if (data.success) listUsers(); // Refresh user list after invite
    }

    function deleteUser(id: string) {
        client.models.User.delete({ id })
      }

    return (
        <>
        <div className="flex flex-col justify-center items-center h-dvh p-5">
            <div className="text-2xl font-bold">Invite a User</div>

            {/* Invite Form */}
            <div className="flex space-x-2 py-10">
                <input type="text" placeholder="Name" className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean" onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button text="Send Invite" colour="bg-favaGreen text-white" onClick={handleInvite} />

            {/* List of Users */}
            <div className="mt-10 w-full max-w-lg">
                <h2 className="text-lg font-semibold">Invited Users</h2>
                {users.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                        {users.map((user) => (
                            <li key={user.id} className="p-2 border rounded-md bg-gray-100">
                                <span className="font-medium">{user.name}</span> - {user.email} - {user.inviteToken} - {user.status}
                                <div className="underline cursor-pointer" onClick={() => deleteUser(user.id)}>Delete</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-2 text-gray-500">No users invited yet.</p>
                )}
            </div>
        </div>
        </>
    );
}

