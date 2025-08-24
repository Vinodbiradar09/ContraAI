import { NextRequest , NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { currentUser } from "@/app/helpers/currentUser";
import Transformed from "@/app/model/Transformation";

export async function DELETE(request : NextRequest , {params} : {params : Promise<{slug : string}>}) {
    try {
        await connectDB();
        const user = await currentUser();
        if(!user){
            return NextResponse.json(
                {
                    message : "Unauthorized User , please login",
                    success : false
                } , {status : 401}
            )
        }

        const {slug} = await params;
        if(!slug){
            return NextResponse.json(
                {
                    message : "Slug is required to delete the academics content history",
                    success : false
                } , {status : 400}
            )
        }

        const delAcademicsContentHistory = await Transformed.findOneAndDelete({
            _id : slug,
            userId : user?.id,
            mode : "academics",
        })

         if(!delAcademicsContentHistory){
                return NextResponse.json(
                    {
                        message : "Failed to delete the Academics content History",
                        success : false,
                    }, {status : 400}
            )
        }

        return NextResponse.json(
        {
            message : "Successfully deleted Academics content History",
            success : true,
        }, {status : 200}
    )
    } catch (error) {
        console.error("Error while deleting the Academics Content history" , error);
        return NextResponse.json(
            {
                message : "Error while deleting the Academics content history , please try again",
                success : false,
            }, {status : 500}
        )
    }
}