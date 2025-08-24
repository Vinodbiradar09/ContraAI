import { NextRequest , NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { currentUser } from "@/app/helpers/currentUser";
import Transformed from "@/app/model/Transformation";

export async function GET(request : NextRequest) {
    try {
        await connectDB();
        const user = await currentUser();
        if(!user){
            return NextResponse.json(
                {
                    message : "Unauthorized User , please login",
                    success : false
                }, {status : 401}
            )
        }
        const {searchParams} = new URL(request.url);
        const mode = searchParams.get('mode');
        if(!mode || mode !== "academics"){
            return NextResponse.json(
                {
                    message : "Mode is required to get the content history",
                    success : false,
                } , {status : 400}
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
                message : "You Have Zero Academics Mode's Content History",
                success : true,
            }, {status : 202}
        )
       }

       const transformAcademicsHistory = transformedContentHistory.map(trans => ({
            _idTransformedAcademicsContent : trans._id,
            transformedAcademicsContent : trans.transformedContent,
            transformedAcademicsWordCount : trans.transformedWordCount
       }))

        return NextResponse.json(
        {
            message : "Successfully got the Academics mode's content history",
            success : true,
            transformAcademicsHistory,
        }, {status : 200}
       )

    } catch (error) {
        console.error("Error while accessing the Academics content history" , error);
        return NextResponse.json(
            {
                message : "Error While accessing the Academics content history",
                success : false,
            }, {status : 500}
        )
    }
}