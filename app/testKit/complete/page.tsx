"use client";
import { useRouter, useSearchParams } from "next/navigation";
import TitleTextBtn from "@/app/components/TitleTextBtn";
import { updateUserStatus } from "@/utils/updateUserStatus";


export default function Complete() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const testDate = searchParams.get('date'); // Extract token from URL

  const nextStep = async () => {
      await updateUserStatus("Posted Kit")
      router.push(`/order`);

  };

  return (
            <TitleTextBtn btnOnClick={nextStep} title="It seems you've taken your test already." btnColour="bg-favaGreen text-white" btnText="View Order Status">
                <>
                If you&apos;ve posted it to us already, we expect to have your results ready by {testDate}.
                <br/><br/>
                Feel free to come back here to check the progress of your test.
                </>
            </TitleTextBtn>
  );
}
