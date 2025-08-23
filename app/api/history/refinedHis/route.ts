import { connectDB } from "@/app/lib/db";
import { currentUser } from "@/app/helpers/currentUser";
import { NextRequest , NextResponse } from "next/server";
import Transformed from "@/app/model/Transformation";

export async function GET(request : NextRequest) {
    try {
        await connectDB();
        const user = await currentUser();
        if(!user){
            return NextResponse.json(
                {
                    message : "Unauthorized access please login",
                    success : false,
                }, {status : 401}
            )
        }
        const  {searchParams}  = new URL(request.url);
        const mode = searchParams.get('mode');
        if(!mode || mode !== "refine"){
            return NextResponse.json(
                {
                    message : "To get the Content Refine , humanize mode is required",
                    success : false,
                }, {status : 403}
            )
        }

        const transformedContentHistory = await Transformed.find({
            userId : user?.id,
            mode : mode,
        })
        if(!transformedContentHistory || transformedContentHistory.length === 0){
            return NextResponse.json(
                {
                    message : "You Have No History Content For Refine Mode",
                    success : true,
                }, {status : 202}
            )
        }

       const transformRefineHistory = transformedContentHistory.map( trans => ({
            transformedRefinedContent : trans.transformedContent,
            transformedRefinedWordCount : trans.transformedWordCount
       }))

        return NextResponse.json(
            {
                message : "Successfully retrived the Refine Content History",
                success : true,
                transformRefineHistory
            }, {status : 200}
        )

    } catch (error) {
        console.error("Error while retriving the Refine Mode Content history" , error);
        return NextResponse.json(
            {
                message : "Error While retriving the Refine Mode Content History",
                success : false,
            },{status : 500}
        )
    }
}