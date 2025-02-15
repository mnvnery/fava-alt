interface ButtonProps {
    text: string;
    colour: string;
    onClick: (() => void) | undefined;
  }
  
const Button = ({ text, colour, onClick }: ButtonProps) => { // Type the props directly
    return (
    <div
        onClick={onClick}
        className={`w-fit ${colour} font-semibold text-sm py-2.5 px-14 rounded-md hover:bg-favaBean focus:outline-none focus:ring-2 focus:ring-favaBean focus:ring-offset-2`}
    >
        {text}
    </div>
    );
};

export default Button;