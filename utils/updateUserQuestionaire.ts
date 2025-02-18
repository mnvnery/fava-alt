// utils/updateUser.ts
import { generateClient } from 'aws-amplify/data';
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"; // Ensure this file exists
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);


const client = generateClient<Schema>({ authMode: "apiKey" });;

interface SelectedAnswers {
    [key: number]: string | string[];
}

export const updateUserQuestionaire = async (userId: string, selectedAnswers: SelectedAnswers) => {

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
        id: userId, 
        dob: dobValue ? new Date(dobValue).toISOString().split("T")[0] : "", 
        gender: selectedAnswers[1] as string,
        sex: selectedAnswers[2] as string,
        ethnicGroup: (selectedAnswers[3] as string) || '', 
        takesMedicines: takesMedicines, // Will store "Prefer not to say" as a string if selected
        medicines: takesMedicines === true ? ((selectedAnswers[5] as string) || '') : '', 
        medicineIssues: takesMedicines === true 
            ? ((selectedAnswers[6] as string[])?.join(", ") || '') 
            : ((selectedAnswers[6] as string[])?.join(", ") || '') , 
        status: "Questionaire Complete"
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
