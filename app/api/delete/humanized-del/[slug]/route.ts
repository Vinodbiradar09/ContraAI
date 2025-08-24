import { connectDB } from "@/app/lib/db";
import Transformed from "@/app/model/Transformation";
import { currentUser } from "@/app/helpers/currentUser";
import { NextRequest , NextResponse } from "next/server";

export async function DELETE(request:NextRequest , { params } : {params : Promise<{slug : string}>} ){
   
    try {
        await connectDB();
        const { slug } = await params;
        if(!slug || slug !== "humanize"){
        return NextResponse.json(
                {
                    message : "slug is required to delete humanized content history",
                    success : false,
                }, {status : 404}
            )
        }
    const user = await currentUser();
    if(!user){
        return NextResponse.json(
            {
                message : "Unauthorized access , please login to perform the action",
                success : false
            } , {status : 401}
        )
    }
    const delHumanizedContentHistory = await Transformed.findOneAndDelete({
        _id : slug,
        userId : user.id,
        mode : "humanize"
    });
    if(!delHumanizedContentHistory){
        return NextResponse.json(
            {
                message : "Failed to delete the humanized content History",
                success : false,
            }, {status : 400}
        )
    }

    return NextResponse.json(
        {
            message : "Successfully deleted Humanized content History",
            success : true,
        }, {status : 200}
    )
    } catch (error) {
        console.error("Error while deleting the humanized Content history" , error);
        return NextResponse.json(
            {
                message : "Error while deleting the humanized content history , please try again",
                success : false,
            }, {status : 500}
        )
    }
}