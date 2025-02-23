import { generateClient } from "aws-amplify/data";
import { v4 as uuidv4 } from "uuid";
import { customAlphabet } from "nanoid"; // Import NanoID
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"; // Ensure this file exists
import type { Schema } from "@/amplify/data/resource";

// ✅ Ensure Amplify is configured before using generateClient
Amplify.configure(outputs, { ssr: true });
const client = generateClient<Schema>({ authMode: "apiKey" }); // Or "userPool" if using Cognito

const generateFavaID = () => {
    const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
    return `FAVA${nanoid()}`;
};

export async function inviteUser(email: string, name: string) {
    const inviteToken = uuidv4(); // Generate a unique token
    const favaId = generateFavaID();

    try {
        const newUser = await client.models.User.create({
            email,
            name,
            favaId,
            inviteToken,
            status: 'Invited'
        });

        console.log("New user created:", newUser);
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}
