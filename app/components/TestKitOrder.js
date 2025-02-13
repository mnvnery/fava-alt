'use client'
import Button from "./Button";
import { useState } from "react";
import TitleTextBtn from './TitleTextBtn'

export default function TestKitOrder() {
    const [isFilled, setIsFilled] = useState(true)
    return (
        <>
        {isFilled ? 
        <TitleTextBtn title="Thank you, your test kit is on its way." btnColour="bg-favaGreen text-white" btnText="Ask away">
            <div>Whilst you wait for your kit to arrive, answer a few questions that will help us personalise your results to you.</div>
        </TitleTextBtn>
        :
        <div className="flex flex-col justify-center items-center w-full h-[85dvh] px-10">
            <div className="text-xl font-bold">Let&apos;s get you a test kit.</div>
            <div className="mt-6 text-sm text-center">
                Please fill in your details and we&apos;ll get a test kit sent out to you in the next two working days.
            </div>
            <form className="w-full mt-8 flex flex-col items-center justify-center">
          {/* Name Field */}
          <div className="mb-4 w-full md:w-[25vw]">
            <label htmlFor="name" className="block text-xs text-favaGrey">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Enter your name"
              required
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
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Address Line 1"
              required
            />
            <input
              type="text"
              id="address-2"
              name="address-2"
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Address Line 2"
            />
            <input
              type="text"
              id="town"
              name="town"
              className="mt-1 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean"
              placeholder="Town"
              required
            />
            <input
              type="text"
              id="postcode"
              name="postcode"
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
            <Button text="Order Test Kit" colour="bg-favaGreen text-white"/>
          </button>
        </form>
        </div>
        }
        </>
    );
}