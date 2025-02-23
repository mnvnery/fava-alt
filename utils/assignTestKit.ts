import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs, { ssr: true });
const client = generateClient<Schema>({ authMode: "apiKey" }); 

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
