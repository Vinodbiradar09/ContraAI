import { NextRequest , NextResponse } from "next/server";
import User from "@/app/model/Users";
import { connectDB } from "@/app/lib/db";
import { sendVerificationEmail } from "@/app/helpers/sendVerification";
import { usernameValidation , signUpValidation } from "@/app/schemas/User.Schema";
import { UserT } from "@/app/types/Sign-up.type";

export async function POST(request : NextRequest) {
    let user;
    try {
        await connectDB();
        const body : UserT = await request.json();
        const {username , email , password} = body;
        const usernameResult = usernameValidation.safeParse(username);
        if(!usernameResult.success){
            const usernameErrors = usernameResult.error.format().username?._errors || []
            return NextResponse.json(
                {
                    message : usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid username format",
                    success : false,
                } , {status : 402}
            )
        }

        const signInResult = signUpValidation.safeParse({username , email , password});
        if(!signInResult.success){
            console.log("signIn" , signInResult.success);
           const formattedErrors = signInResult.error.format();
              const signInErrors = [
                ...(formattedErrors.username?._errors || []),
                ...(formattedErrors.email?._errors || []),
                ...(formattedErrors.password?._errors || []),
            ];
            return NextResponse.json(
                {
                    message:
                    signInErrors.length > 0
                    ? signInErrors.join(", ")
                    : "Invalid username or email or password format",
                    success: false,
                },
                { status: 403 }
            );
        }

        const existingVerifiedUserWithUsername = await User.findOne({username , isVerified : true});
        if(existingVerifiedUserWithUsername){
            return NextResponse.json(
                {
                    success : false,
                    message : "Username is already taken",
                } , {status : 400}
            )
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserWithEmail = await User.findOne({email});
        if(existingUserWithEmail){
            if(existingUserWithEmail.isVerified){
                return NextResponse.json(
                    {
                        success : false,
                        message : "User already exist with this email",
                    }, {status : 400}
                )
            } else {
                existingUserWithEmail.verifyCode = verifyCode;
                existingUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserWithEmail.save();
            }
        } else {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = await User.create({
                username,
                email,
                password,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
            });

            if(!newUser){
                return NextResponse.json(
                    {message : "Failed to sign-up new user" , success : false}, {status : 404}
                )
            }

            user = newUser;
        }
        const emailResponse = await sendVerificationEmail(email , username , verifyCode);
        if(!emailResponse.success){
            return NextResponse.json(
                {
                    message : "Failed to send verification code to your email address",
                    success : false,
                }, {status : 400},
            )
        }
        const safeUser = {
            id: user?._id,
            username: user?.username,
            email: user?.email,
            isVerified: user?.isVerified,
        };
        return NextResponse.json(
            {
                message : "User registered successfully , Please verify your account",
                success : true,
                user : safeUser,
            }, {status : 200}
        )
    } catch (error) {
        console.error("Error while sign-up user" , error);
        return NextResponse.json(
            {
                message : "Error while registering the user",
                success : false,
            } , {status : 500}
        )
    }
}