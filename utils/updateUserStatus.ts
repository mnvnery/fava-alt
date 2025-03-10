// utils/updateUserStatus.ts
import { generateClient } from 'aws-amplify/data';
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"; // Ensure this file exists
import type { Schema } from "@/amplify/data/resource";
import { getSignedUser } from './getSignedUser';

Amplify.configure(outputs, { ssr: true });

const client = generateClient<Schema>({ authMode: "apiKey" });;


export const updateUserStatus = async (status: string) => { // Accept nullable userId

    const signedUser = await getSignedUser();

    if (!signedUser) { // Early exit if userId is null or undefined
        console.error("User ID is missing.");
        return null;
    }

    try {
        const updatedUser = {
            id: signedUser.id, // Use the provided userId
            status: status,
        };

        const { data, errors } = await client.models.User.update(updatedUser);

        if (errors) {
            console.error('Error updating user status:', errors);
            return null;
        } else {
            console.log('User status updated successfully:', data);
            return data;
        }
    } catch (error) {
        console.error("Error in updateUserStatus:", error);
        return null;
    }
};