export default function Button({text, colour, onClick}) {
    return (
        <div onClick={onClick} className={`w-fit ${colour} font-semibold text-sm py-2.5 px-14 rounded-md hover:bg-favaBean focus:outline-none focus:ring-2 focus:ring-favaBean focus:ring-offset-2`}>
            {text}
        </div>
    );
}