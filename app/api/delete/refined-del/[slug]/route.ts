import { NextRequest , NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Transformed from "@/app/model/Transformation";
import { currentUser } from "@/app/helpers/currentUser";

export async function DELETE(request : NextRequest , {params} : {params : Promise<{slug : string}>}) {
    try {
        await connectDB();
        const {slug} = await params;
        if(!slug){
            return NextResponse.json(
                {
                    message : "Slug is required to delete the refined content history , and it must be refine mode only",
                    success : false
                }, {status : 404}
            )
        }
        const user = await currentUser();
        if(!user){
            return NextResponse.json(
                {
                    message : "Unauthorized user , please login",
                    success : false,
                } , {status : 401}
            )
        }
        const delRefinedContentHistory = await Transformed.findOneAndDelete({
            _id : slug,
            userId : user.id,
            mode : "refine"
        })
        if(!delRefinedContentHistory){
            return NextResponse.json(
                {
                    message : "failed to delete the refined content history",
                    success : false,
                } , {status : 404}
            )
        }

        return NextResponse.json(
            {
                message : "Successfully deleted the refined content history",
                success : true,
            } , {status : 200}
        )
    } catch (error) {
        console.error("Error while deleting the refined content history" , error);
        return NextResponse.json(
            {
                message : "Error while deleting the refined content history",
                success : false
            } , {status : 500}
        )
    }
}