import { getCurrentUser } from 'aws-amplify/auth';

export async function isSignedIn() {
  try {
    const user = await getCurrentUser();
    return !!user; // Returns true if the user is signed in
  } catch (error) {
    console.log(error)
    return false; // Returns false if there's no authenticated user
  }
}
