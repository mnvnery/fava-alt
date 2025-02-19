"use client";
import { useRouter, useParams } from "next/navigation";
import KitConnection from "@/app/components/KitConnection";
import TitleTextBtn from "@/app/components/TitleTextBtn";
import dynamic from "next/dynamic";
import { updateUserStatus } from "@/utils/updateUserStatus";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const steps = ["connect", "instructions", "post", "confirmation"];

const today = new Date();
today.setMonth(today.getMonth() + 1);
const formattedDate = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function TestKitStep() {
  const router = useRouter();
  const { step } = useParams();
  const currentIndex = steps.indexOf(step as string);

  const nextStep = async () => {
    if (currentIndex < steps.length - 1) {
      router.push(`/testKit/${steps[currentIndex + 1]}`);
    } else {
      await updateUserStatus("Posted Kit")
      router.push('/order')
    }
  };


  return (
    <div>
        {step === "connect" && <KitConnection/>}
        {step === "instructions" && 
        <TitleTextBtn btnOnClick={nextStep} title="Do your test." btnColour="bg-favaGreen text-white" btnText="Done">
            <div>
            Follow the instructions on your test kit or watch the video below to provide your sample.
            <br/>
            <div className="relative w-[90vw] md:w-[50vw] aspect-video mt-10">
                <ReactPlayer
                url={'https://www.youtube.com/watch?v=svX0ZzWZL98&themeRefresh=1'}
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
                controls
                />
            </div>
            </div>
        </TitleTextBtn>}
        {step === "post" && 
            <TitleTextBtn btnOnClick={nextStep} title="Post your kit back to us" btnColour="bg-favaGreen text-white" btnText="Done">
                <>
                Phew, that was a lot of spit!
                <div className="my-10 text-center text-lg">
                    <div className="font-bold">1. Insert your sample into the pre-labelled envelope provided.</div>
                    <div className="font-bold">2. Drop your envelope off at a post office.</div>
                </div>
                </>
            </TitleTextBtn>}
        {step === "confirmation" && 
            <TitleTextBtn btnOnClick={nextStep} title="Nice work. We’ll let you know when we’ve received your sample." btnColour="bg-favaGreen text-white" btnText="All done">
                <>
                We expect to have your results ready by <strong>{formattedDate}</strong>.
                <br/><br/>
                Feel free to come back here to check the progress of your test.
                </>
            </TitleTextBtn>}
    </div>
  );
}
