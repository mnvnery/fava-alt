import Button from "./Button";

const ResetPassword = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-[80dvh] text-center px-5">
            <div className="text-xl font-bold">Have you received one of our test kits already?</div>
            <div className="mt-6 text-sm text-center">
                You may have been given one by your employer. 
                <br/><br/>
                If not, don’t worry. We’ll sort you out.
            </div>
            <div className="flex space-x-6 mt-8">
            <Button text="Yes" colour="bg-favaGreen text-white" onClick={undefined}/>
            <Button text="No" colour="bg-favaBean text-favaGreen" onClick={undefined}/>
            </div>
        </div>
    );
}

export default ResetPassword;