import { JSX } from "react";
import Button from "./Button";

interface TitleTextBtnProps {
    title: string;
    btnText: string;
    btnColour: string;
    children: string | JSX.Element | JSX.Element[] ;
    btnOnClick:  (() => void) | undefined;
  }
  
export default function TitleTextBtn({ title, children, btnText, btnColour, btnOnClick }: TitleTextBtnProps) {
    return (
        <div className="flex flex-col justify-center items-center w-full h-[80dvh] text-center px-12">
            <div className="text-xl font-bold">{title}</div>
            <div className="mt-6 text-sm text-center">
                {children}
            </div>
            <div className="flex space-x-6 mt-14">
                <Button onClick={btnOnClick} text={btnText} colour={btnColour} />
            </div>
        </div>
    );
}