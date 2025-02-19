interface OrderStatusProps {
    userStatus: string;
}
  
const OrderStatus = ({ userStatus }: OrderStatusProps) => { // Type the props directly
    console.log(userStatus)
    return (
    <div className="text-center px-8 h-[80dvh] flex flex-col items-center justify-center">
        <div className="mt-20">
        <div className="text-sm uppercase tracking-wider">NOW</div>
        <h1 className="mt-2 text-xl font-bold">We’re waiting to receive your sample.</h1>
        <p className="mt-2">
          You’ve sent us your spit! We’ll let you know when we’ve received it.
        </p>
      </div>

      {/* Progress Dotted Line */}
      <div className="flex flex-col items-center mt-6">
        <div className="h-10 border-l-2 border-dashed border-gray-500"></div>
      </div>

      {/* Testing Stage */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">Testing your sample.</h2>
        <p>Your sample will be tested at our partner lab.</p>
      </div>

      {/* Progress Dotted Line */}
      <div className="flex flex-col items-center mt-6">
        <div className="h-10 border-l-2 border-dashed border-gray-500"></div>
      </div>

      {/* Results Stage */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">Receive your results.</h2>
        <p>
          You will be able to access your results directly here, in your account.
        </p>
      </div>
    </div>
  );
};

export default OrderStatus;