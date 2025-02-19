import * as React from "react";

interface EmailTemplateProps {
  name: string;
  link: string;
}

export const InviteEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  link,
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
    <h1 style={{ color: "black", textAlign: "center" }}>Welcome, {name}!</h1>

    {/* Message */}
    <p style={{ color: "black", textAlign: "center", fontSize: "16px" }}>
      You've been invited by your company to join <strong>Fava Health</strong>.
    </p>
    <p style={{ color: "black", textAlign: "center", fontSize: "16px" }}>Click the button below to create an account.</p>

    {/* Call-to-Action Button */}
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <a 
        href={link} 
        style={{
          backgroundColor: "#0D2C26", 
          color: "#fff", 
          textDecoration: "none", 
          fontSize: "14px",
          padding: "12px 30px", 
          borderRadius: "10px", 
          display: "inline-block",
          marginTop: "30px"
        }}
      >
        <strong>Create your account</strong>
      </a>
    </div>
  </div>
      {/* Footer */}
    <p style={{ color: "#888", textAlign: "center", fontSize: "12px", marginTop: "20px" }}>
      If you did not request this invitation, please ignore this email.
    </p>
  </div>
);
