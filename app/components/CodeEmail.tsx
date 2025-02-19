import * as React from "react";

interface EmailTemplateProps {
  code: string;
}

export const CodeEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  code,
}) => (
<div style={{ fontFamily: "Helvetica, sans-serif", backgroundColor: "#F4F1ED", padding: "15px" }}>
  <div style={{ padding: "50px 20px 70px 20px" }}>
    {/* Logo or Banner */}
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <img 
        src="https://main.d229nqb8o38upi.amplifyapp.com/img/Fava-logo-dark.svg" 
        alt="Fava Health Logo" 
        style={{ width: "300px", height: "auto" }} 
      />
    </div>

    {/* Greeting */}
    <h1 style={{ color: "black", textAlign: "center" }}>Thank you for signing up to Fava Health!</h1>

    {/* Message */}
    <p style={{ color: "black", textAlign: "center", fontSize: "16px" }}>
      Use this code to confirm your account
    </p>
    <p style={{ color: "black", textAlign: "center", fontSize: "24px" }}><strong>{code}</strong></p>

  </div>
      {/* Footer */}
    <p style={{ color: "#888", textAlign: "center", fontSize: "12px", marginTop: "20px" }}>
      If you did not request this sign up, please ignore this email.
    </p>
  </div>
);
