import { NextRequest , NextResponse } from "next/server";
import { verifyCodeValidation } from "@/app/schemas/User.Schema";
import User from "@/app/model/Users";
import { connectDB } from "@/app/lib/db";
import { VerifyT } from "@/app/types/verify.type";

export async function POST(request : NextRequest) : Promise<NextResponse> {
    try {
        await connectDB();
        const body : VerifyT = await request.json();
        const {username , verifyCode} = body;
        const decodedUsername = decodeURIComponent(username);
        const codeResult = verifyCodeValidation.safeParse({verifyCode});
        if(!codeResult.success){
            const codeErrors = codeResult.error.format().verifyCode?._errors || [];
            return NextResponse.json(
                {
                    success : false,
                    message : codeErrors.length > 0 ? codeErrors.join(', ') : "Invalid code format",
                },{status : 400}
            )
        }
        const user = await User.findOne({username : decodedUsername});
        if(!user){
            return NextResponse.json(
                {
                    success : false,
                    message : "User not found",
                }, {status : 404}
            )
        }
        const isCodeValid = user.verifyCode === verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if(isCodeValid && isCodeNotExpired){
            await User.findByIdAndUpdate(user._id , {
                $set : {
                    isVerified : true,
                }
            }, {new : true , runValidators : true},
        )

        return NextResponse.json(
            {
                message : "Account verified successfully",
                success : true,
            }, {status : 200}
        )
    } else if(!isCodeNotExpired){
        return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    } else {
        return NextResponse.json(
            {
                success : false,
                message : "Invalid verification code",
            } , {status : 404}
        )
    }
    } catch (error) {
        console.error("Error occured verifying the code" , error);
        return NextResponse.json(
            {
                success : false,
                message : "Error verifying user",
            }, {status : 500}
        )
    }
}