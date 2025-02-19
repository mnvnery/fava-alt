import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"; // Ensure this file exists
import type { Schema } from "@/amplify/data/resource";

// ✅ Ensure Amplify is configured before using generateClient
Amplify.configure(outputs);

const client = generateClient<Schema>({ authMode: "apiKey" }); // Or "userPool" if using Cognito

export async function assignTestKit(userId: string, testKitSerial: string) {
    try {
        const newTestKit = await client.models.TestKit.create({
            testKitSerial: testKitSerial, 
            userId: userId
        });

        console.log("Test assined:", newTestKit);
        return newTestKit;
    } catch (error) {
        console.error("Error assigning test:", error);
        throw error;
    }
}
