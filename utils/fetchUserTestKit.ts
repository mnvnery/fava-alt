// utils/updateUser.ts
import { generateClient } from 'aws-amplify/data';
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"; // Ensure this file exists
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);


const client = generateClient<Schema>({ authMode: "apiKey" });;


export const fetchUserTestKit = async (userId: string) => {

    // Call the Amplify client to update the user model
    const { data: user, errors } = await client.models.TestKit.list({
        filter: {
            userId: {  // <-- Wrap email in a StringFilter object
                eq: userId, // Use the 'eq' (equals) operator
            },
        }
    });
    
    if (errors && errors.length > 0) {
        console.error("Error fetching testKit:", errors);
        throw new Error("Failed to fetch user"); // Or return null, or handle differently
    }

    if (user && user.length > 0) {
        return user[0]; // Return the first user object if found
    } else {
        return null; // Or throw an error, or return a default object
    }
};
