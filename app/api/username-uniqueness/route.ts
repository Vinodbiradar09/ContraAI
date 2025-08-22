import User from "@/app/model/Users";
import { connectDB } from "@/app/lib/db";
import { usernameValidation } from "@/app/schemas/User.Schema";
import { NextRequest , NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username : usernameValidation,
});

export async function GET(request : NextRequest) : Promise<NextResponse>{
    try {
        await connectDB();
        const {searchParams} = new URL(request.url);
         const queryParams = {
            username : searchParams.get('username'),
        };
        const result = UsernameQuerySchema.safeParse(queryParams);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return NextResponse.json(
                {
                    message : usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters",
                    success : false,
                } , {status : 400}
            )
        }

        const {username} = result.data;

        const existingVerifiedUser = await User.findOne({username , isVerified : true});
        if(existingVerifiedUser){
            return NextResponse.json(
                {
                    success : false,
                    message : "Username is already taken",
                } , {status : 404}
            )
        } 
        return NextResponse.json(
                {
                    success : true,
                    message : "Username is unique",
                }
        )
    } catch (error) {
        console.error("Error while checking the username", error);
        return NextResponse.json({
            success: false,
            message: "Error checking Username",
        }, { status: 500 });
    }
}