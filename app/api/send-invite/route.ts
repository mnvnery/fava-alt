import { Resend } from 'resend';
import { inviteUser } from "@/utils/inviteUser";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API);

export async function POST(req: Request) {
    try {
        const { email, name } = await req.json();
        if (!email || !name) {
            return NextResponse.json({ error: "Missing email or name" }, { status: 400 });
        }

        const newUser = await inviteUser(email, name); // Await the promise!

        
        if (!newUser || !newUser.data || !newUser.data.inviteToken) { // Access data.inviteToken!
            console.error("Error: inviteUser did not return a valid user with inviteToken", newUser);
            return NextResponse.json({ error: "Failed to create user or generate invite token" }, { status: 500 });
        }

        const inviteLink = `https://main.d229nqb8o38upi.amplifyapp.com/invite?token=${newUser.data.inviteToken}`;

        try {
            console.log("Sending invite email...");
            const emailResponse = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Hello World',
                html: `You've been invited to Fava Health! Click here: ${inviteLink}`
            });
            console.log("Resend Response:", emailResponse);
        } catch (emailError) {
            console.error("Error sending email with Resend:", emailError);
        }

        return NextResponse.json({ success: true, message: "Invite sent!" }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error sending invite:", error);
    
        let errorMessage = "Failed to send invite";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
    
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}