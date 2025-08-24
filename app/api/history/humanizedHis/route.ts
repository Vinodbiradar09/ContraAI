import { connectDB } from "@/app/lib/db";
import { currentUser } from "@/app/helpers/currentUser";
import { NextRequest , NextResponse } from "next/server";
import { ModeT } from "@/app/types/mode";
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
        if(!mode || mode !== "humanize"){
            return NextResponse.json(
                {
                    message : "To get the Content History , humanize mode is required",
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
                    message : "You Have No History Content For Humanize Mode",
                    success : true,
                }, {status : 202}
            )
        }
        const transformHumanizeHistory = transformedContentHistory.map(trans => ({
            _idTransformedHumanizedContent : trans._id,
            transformedHumanizedContent : trans.transformedContent,
            transformedHumanizedWordCount : trans.transformedWordCount,
        }))

        return NextResponse.json(
            {
                message : "Successfully retrived the Humanize Content History",
                success : true,
                transformHumanizeHistory
            }, {status : 200}
        )

    } catch (error) {
        console.error("Error while retriving the Humanize Mode Content history" , error);
        return NextResponse.json(
            {
                message : "Error While retriving the Humanize Mode Content History",
                success : false,
            },{status : 500}
        )
    }
}