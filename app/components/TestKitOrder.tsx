'use client'
import { useState } from "react";
import Button from "./Button";
import { updateUser } from '@/utils/updateUser';

interface OrderProps {
  userId: string;
  name: string;
  onClick: (() => void);
}

const TestKitOrder = ({ userId, name, onClick }: OrderProps) => {
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")
  const [city, setCity] = useState("")
  const [county, setCounty] = useState("")
  const [postcode, setPostcode] = useState("")


  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser = {
      address1: address1, 
      address2: address2, 
      city: city,
      county: county,
      postcode: postcode, 
      status: "Kit Ordered"
    }
    try {
        await updateUser(userId, updatedUser);
        onClick?.();
    } catch(error) {
        console.log(error)
    }
  };

    return (
        <div className="flex flex-col justify-center items-center w-full h-[85dvh] px-10">
            <div className="text-2xl font-bold">Let&apos;s get you a test kit.</div>
            <div className="mt-6 text-base text-center">
                Please fill in your details and we&apos;ll get a test kit sent out to you in the next two working days.
            </div>
        <form onSubmit={handleUpdateOrder} className="w-full mt-8 flex flex-col items-center justify-center">
          {/* Name Field */}
          <div className="mb-4 w-full md:w-[25vw]">
            <label htmlFor="name" className="block text-xs text-favaGrey">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name} // Pre-filled with prop value
              readOnly // Make it read-only
              className="mt-1 text-sm block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Address Field */}
          <div className="mb-4 w-full md:w-[25vw]">
            <label htmlFor="address" className="block text-xs text-favaGrey">
              Address
            </label>
            <input
              type="text"
              id="address-1"
              name="address-1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Address Line 1"
              required
            />
            <input
              type="text"
              id="address-2"
              name="address-2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Address Line 2"
            />
            <input
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="City"
              required
            />
            <input
              type="text"
              id="county"
              name="county"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="County"
              required
            />
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Postcode"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-8"
          >
            <Button onClick={undefined} text="Order Test Kit" colour="bg-favaGreen text-white"/>
          </button>
        </form>
        </div>
    );
}

export default TestKitOrder;