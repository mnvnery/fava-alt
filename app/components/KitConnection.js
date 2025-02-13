import Image from 'next/image';
import Button from './Button'

export default function KitConnection() {
    return (
        <div className="flex flex-col justify-center items-center w-full h-[80dvh] text-center px-12">
            <div className="text-xl font-bold">Let’s connect your test kit to your account.</div>
            <div className="mt-6 text-sm text-center">
                Please enter your test kit’s ID number. <br/>
                You can find the ID on [xxxx]
            </div>
            <Image 
                src={"/img/id-illus.jpg"}
                width={250}
                height={100}
                alt="Fava Logo"
                className="mt-8"
            />
            <input
              type="text"
              id="test-kit-id"
              name="test-kit-id"
              className="mt-9 text-sm block w-full px-3 py-2 border border-favaGreen rounded-md focus:outline-none focus:ring-favaBean focus:border-favaBean md:w-[25vw]"
              placeholder="Test Kit ID"
              required
            />
            <div className="flex space-x-6 mt-14">
                <Button text="Submit" colour="bg-favaGreen text-white" />
            </div>
        </div>
    );
}