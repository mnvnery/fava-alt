import Button from "./Button";
interface ResetPasswordProps {
    onClickHome: (() => void) | undefined;
    onClickInPerson: (() => void) | undefined;
}
const ResetPassword = ({onClickHome, onClickInPerson} : ResetPasswordProps) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-[80dvh] text-center px-5">
            <div className="text-xl font-bold">We&apos;ll be coming to the Genedrive offices to collect samples.</div>
            <div className="mt-6 text-sm text-center">
                But if that doesn&apos;t work for you, don&apos;t worry.
                <br/>
                We can post a test out to you.
            </div>
            <div className="flex space-x-6 mt-8">
            <Button text="In Office Test" colour="bg-favaGreen text-white" onClick={onClickInPerson}/>
            <Button text="Order Home Test" colour="bg-favaBean text-favaGreen" onClick={onClickHome}/>
            </div>
        </div>
    );
}

export default ResetPassword;