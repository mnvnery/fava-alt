import { generateClient } from 'aws-amplify/data';
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"; // Ensure this file exists
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs, { ssr: true });
const client = generateClient<Schema>({ authMode: "apiKey" });

interface User { 
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

export const updateUser = async (userId: string | null | undefined, updates: Partial<User>) => {
    if (!userId) { 
        console.error("User ID is missing.");
        return null;
    }

    try {
        const { data, errors } = await client.models.User.update({ id: userId, ...updates });

        if (errors) {
            console.error('Error updating user:', errors);
            return null;
        } else {
            console.log('User updated successfully:', data);
            return data;
        }
    } catch (error) {
        console.error("Error in updateUser:", error);
        return null;
    }
};
