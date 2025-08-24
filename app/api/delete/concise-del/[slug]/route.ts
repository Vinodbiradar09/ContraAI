import { NextRequest , NextResponse } from "next/server";
import { currentUser } from "@/app/helpers/currentUser";
import Transformed from "@/app/model/Transformation";
import { connectDB } from "@/app/lib/db";

export async function DELETE(request : NextRequest , {params} : {params : Promise<{slug : string}>}){
    try {
        await connectDB();
        const user = await currentUser();
        if(!user){
            return NextResponse.json(
                {
                    message : "Unauthorized User , Please try again",
                    success : false,
                }, {status : 401}
            )
        }

        const {slug} = await params;
        if(!slug){
            return NextResponse.json(
                {
                    message : "Slug is required to perform the delete action",
                    success : false,
                }, {status : 400}
            )
        }
        const delConcisedContentHistory = await Transformed.findOneAndDelete(
            {
                _id : slug,
                userId : user.id,
                mode : "concise"
            }
        )

        if(!delConcisedContentHistory){
            return NextResponse.json(
                {
                    message : "Failed to delete the Concised Content history",
                    success : false,
                },{status : 404}
            )
        }

        return NextResponse.json(
            {
                message : "successfully deleted the concised content history",
                success : true,
            }, {status : 200}
        )
    } catch (error) {
        console.error("Error while deleting the Concised Content history" , error);
        return NextResponse.json(
            {
                message : "Error while deleting the Concised content history , please try again",
                success : false,
            }, {status : 500}
        )
    }
}