// utils/updateUser.ts
import { generateClient } from 'aws-amplify/data';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"; // Ensure this file exists
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs, { ssr: true });

const client = generateClient<Schema>({ authMode: "apiKey" });;


export const getSignedUser = async () => {

    const fetchedUserAttributes = await fetchUserAttributes();

    // Call the Amplify client to update the user model
    const { data: user, errors } = await client.models.User.list({
        filter: {
            email: {  // <-- Wrap email in a StringFilter object
                eq: fetchedUserAttributes?.email, // Use the 'eq' (equals) operator
            },
        }
    });
    
    if (errors && errors.length > 0) {
        console.error("Error fetching user:", errors);
        throw new Error("Failed to fetch user"); // Or return null, or handle differently
    }

    if (user && user.length > 0) {
        return user[0]; // Return the first user object if found
    } else {
        return null; // Or throw an error, or return a default object
    }
};
