import { currentUser } from "@/app/helpers/currentUser";
import Transformed from "@/app/model/Transformation";
import { NextRequest , NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";

export async function GET(request : NextRequest) {
    try {
       await connectDB();
       const user = await currentUser();
       if(!user){
        return NextResponse.json(
            {
                message : "Unauthorized User , please login",
                success : false,
            }, {status : 401}
        )
       } 
       const {searchParams} = new URL(request.url);
        const mode = searchParams.get('mode');
       if(!mode || mode !== "concise"){
            return NextResponse.json(
                {
                    message : "Mode is required to get the content history",
                    success : false,
                }, {status : 402}
            )
       }
       const transformedContentHistory = await Transformed.find(
        {
            userId : user?.id,
            mode : mode,
        }
       )

       if(!transformedContentHistory || transformedContentHistory.length === 0){
        return NextResponse.json(
            {
                message : "You Have Zero Concise Mode's Content History",
                success : true,
            }, {status : 202}
        )
       }

       const transformConciseHistory = transformedContentHistory.map(trans => ({
            _idTransformedConciseContent : trans._id,
            transformedConciseContent : trans.transformedContent,
            transformedRefinedWordCount : trans.transformedWordCount,
       }))

       return NextResponse.json(
        {
            message : "Successfully got the concise mode's content history",
            success : true,
            transformConciseHistory,
        }, {status : 200}
       )
    } catch (error) {
        console.error("Error while accessing the concise content history" , error);
        return NextResponse.json(
            {
                message : "Error While accessing the concise content history",
                success : false,
            }, {status : 500}
        )
    }
}