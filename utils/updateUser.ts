// utils/updateUser.ts
import { generateClient } from 'aws-amplify/data';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"; // Ensure this file exists
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);


const client = generateClient<Schema>({ authMode: "apiKey" });;

interface SelectedAnswers {
    [key: number]: string | string[];
}

export const updateUser = async (selectedAnswers: SelectedAnswers) => {

    const fetchedUserAttributes = await fetchUserAttributes();

    const dobValue = Array.isArray(selectedAnswers[0]) 
    ? selectedAnswers[0][0]  // If it's an array, take the first value
    : selectedAnswers[0];  // Otherwise, use it directly

    const takesMedicinesRaw = selectedAnswers[4] as string;
    const takesMedicines = takesMedicinesRaw === 'Yes' 
        ? true 
        : takesMedicinesRaw === 'No' 
        ? false 
        : null; 

    // Map answers to user model fields
    const updatedUser = {
        id: fetchedUserAttributes?.["custom:user_id"] as string, 
        dob: dobValue ? new Date(dobValue).toISOString().split("T")[0] : "", 
        gender: selectedAnswers[1] as string,
        sex: selectedAnswers[2] as string,
        ethnic_group: (selectedAnswers[3] as string) || '', 
        takes_medicines: takesMedicines, // Will store "Prefer not to say" as a string if selected
        medicines: takesMedicines === true ? ((selectedAnswers[5] as string) || '') : '', 
        medicine_issues: takesMedicines === true 
            ? ((selectedAnswers[6] as string[])?.join(", ") || '') 
            : ((selectedAnswers[6] as string[])?.join(", ") || '') , 
        isActivated: true, 
        inviteToken: "", 
    };
    // Call the Amplify client to update the user model
    const { data, errors } = await client.models.Users.update(updatedUser);

    if (errors) {
        console.error('Error updating user:', errors);
    } else {
        console.log('User updated successfully:', data);
    }

    return data; // Return the updated user data
};
