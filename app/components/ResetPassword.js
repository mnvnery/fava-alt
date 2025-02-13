'use client'
import { useState } from 'react';
import { resetPassword, confirmResetPassword } from '@aws-amplify/auth'; // Import resetPassword
import Image from 'next/image';
import Button from './Button'; // Assuming this is your custom button component
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState('request'); // 'request' or 'confirm'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const output = await resetPassword({ username: email }); // Await the promise
  
      const { nextStep } = output; // Get the next step
      switch (nextStep.resetPasswordStep) {
        case 'CONFIRM_RESET_PASSWORD_WITH_CODE': // Check if code was sent
          const codeDeliveryDetails = nextStep.codeDeliveryDetails;
          console.log(`Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`);
          setStage('confirm'); // Move to the confirmation stage
          break;
        case 'DONE': // Unlikely in this case, but good to handle
          console.log('Successfully initiated password reset.');
          // This might happen if the user has already confirmed their email
          // or if you have a custom auth flow.
          setStage('confirm'); // You might want to handle this differently
          break;
        default: // Handle unexpected next steps
          console.warn('Unexpected next step:', nextStep.resetPasswordStep);
          setError('An unexpected error occurred.');
          break;
      }
    } catch (err) {
      setError(err.message);
      console.error('Error requesting code:', err);
    } finally {
      setLoading(false);
    }
  };

// ... and for confirming the password reset:

const handleConfirmPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await confirmResetPassword({ // Use confirmResetPassword
        username: email,
        code,
        newPassword,
      });
      // Redirect or show success message
      alert('Password reset successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error confirming password:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Image
        src="/img/Fava-logo-dark.svg"
        width={350}
        height={250}
        alt="Fava Logo"
        className="mt-[5vh]"
      />
      <div className="text-xl font-bold">Reset Your Password</div>

      {error && <p className="text-red-500 mt-4">{error}</p>} {/* Error display */}

      {stage === 'request' ? (
        <form onSubmit={handleRequestCode} className="w-full mt-8 flex flex-col items-center justify-center px-10">
          <div className="mb-4 w-full md:w-[25vw]">
            <label htmlFor="email" className="block text-xs text-favaGrey">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="mt-8">
            <Button text={loading ? "Sending..." : "Send Code"} colour="bg-favaGreen text-white" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmPassword} className="w-full mt-8 flex flex-col items-center justify-center px-10">
          <div className="mb-4 w-full md:w-[25vw]">
            <label htmlFor="code" className="block text-xs text-favaGrey">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Enter your code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 w-full md:w-[25vw]">
            <label htmlFor="newPassword" className="block text-xs text-favaGrey">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="mt-8">
            <Button text={loading ? "Resetting..." : "Reset Password"} colour="bg-favaGreen text-white" />
          </button>
        </form>
      )}

      {/* Conditionally render the "Have an account?" link */}
      {stage === 'request' && ( // Only show on the "request code" stage
        <div className="mt-8 text-sm">
          Have an account already? <span className="underline cursor-pointer">Log in here</span>
        </div>
      )}

    </div>
  );
}

export default ResetPassword;