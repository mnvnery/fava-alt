import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */

const customEmailBody = (createCode: () => string) => `
  <div style="font-family: Helvetica, sans-serif; background-color: #F4F1ED; padding: 15px;">
    <div style="padding: 50px 20px 70px 20px;">
      <!-- Logo or Banner -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://main.d229nqb8o38upi.amplifyapp.com/img/Fava-logo-dark.svg" 
             alt="Fava Health Logo" style="width: 300px; height: auto;" />
      </div>

      <!-- Greeting -->
      <h1 style="color: black; text-align: center;">Thank you for signing up to Fava Health!</h1>

      <!-- Message -->
      <p style="color: black; text-align: center; font-size: 16px;">
        Use this code to confirm your account
      </p>
      <p style="color: black; text-align: center; font-size: 24px;"><strong>${createCode()}</strong></p>
    </div>

    <!-- Footer -->
    <p style="color: #888; text-align: center; font-size: 12px; margin-top: 20px;">
      If you did not request this code, please ignore this email.
    </p>
  </div>
`;
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE", // The email will contain a code for verification
      verificationEmailSubject: "Welcome to Fava Health!", // Subject of the email
      verificationEmailBody: customEmailBody, // Your custom HTML template for the email body
    },
  },
  groups: ["ADMINS"],
  userAttributes: {
    "custom:user_id": {
      dataType: "String", 
      mutable: true, 
    }, 
  }
});
