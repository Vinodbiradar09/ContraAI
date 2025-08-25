import { resend } from "../lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiRes } from "../types/ApiResponse";

export const sendVerificationEmail = async (email : string , username : string , otp : string) : Promise<ApiRes> =>{
    try {
        
        const {data , error} = await resend.emails.send({
         from: 'Acme <onboarding@resend.dev>',
         to : email,
         subject : "CONTRA-AI | VERIFICATION-CODE",
         react : VerificationEmail({username , otp})
        });

        if(error){
            console.error("failed to send the verification code to email" , error.message);
            return {message : "Failed to send verification code to your email address" , success : false}
        }
        console.log("email queued successfully" , data);
        return {message : "Successfully verification code sent to your email" , success : true}

    } catch (emailError) {
        console.error("Unexpected error while sending verification email:", emailError);
        return { success: false, message: "Unexpected error while sending verification email" };
    }
}

