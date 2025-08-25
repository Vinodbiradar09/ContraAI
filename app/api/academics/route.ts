import { connectDB } from "@/app/lib/db";
import { NextRequest , NextResponse } from "next/server";
import { currentUser } from "@/app/helpers/currentUser";
import UserM from "@/app/model/Users";
import Transformed from "@/app/model/Transformation";
import { sanitizeInput } from "@/app/helpers/wordsCount";
import { countWords } from "@/app/helpers/wordsCount";
import { perplexityApiCallAcademics } from "@/app/helpers/perplexityAcademics";
import { contentValidation } from "@/app/schemas/TransformContent.Schema";

export async function POST(request : NextRequest) {
    try {
        await connectDB();
        const user = await currentUser();
        if(!user){
            return NextResponse.json(
                {
                    message : "Unauthorized User , Please login",
                    success : false
                }, {status : 401}
            )
        }

        const {originalContent} = await request.json();
        if(!originalContent || typeof originalContent !== "string"){
            return NextResponse.json(
                {
                    message : "Original content is required to get the academics content from it ",
                    success : false,
                } , {status : 400}
            )
        }
        const originalWordCount = countWords(originalContent);
        const validation = contentValidation.safeParse({originalContent , originalWordCount});
        if(!validation.success){
            const formattedErrors = validation.error.format();
            const errors = [
                ...(formattedErrors.originalContent?._errors || []),
                ...(formattedErrors.originalWordCount?._errors || []),
            ];

            return NextResponse.json(
                {
                    message : errors.length > 0 ? errors.join(', ') : "Content must be provided and have at least 10 characters",
                    success : false,
                }, {status : 400}
            )
        }

        const sanitizedOriginalContent = sanitizeInput(originalContent);
        const transformedContent = await perplexityApiCallAcademics(sanitizedOriginalContent);
        if(!transformedContent){
             return NextResponse.json(
                { message: "Failed to generate transformed academics content", success: false },
                { status: 500 }
            );
        }

        const transformedContentWordCount = countWords(transformedContent);

        const loggedUser = await UserM.findById(user.id);
        if(!loggedUser){
             return NextResponse.json(
                { message: "User not found", success: false },
                { status: 404 }
            );
        }

        const transformedDoc = await Transformed.create({
            userId : loggedUser._id,
            mode : "academics", 
            originalContent : sanitizedOriginalContent,
            transformedContent : transformedContent,
            originalWordCount : originalWordCount,
            transformedWordCount : transformedContentWordCount,
        })

        if(!transformedDoc){
             return NextResponse.json(
                { message: "Failed to save the Academics content", success: false },
                { status: 500 }
            );
        }

         return NextResponse.json({
            success: true,
            content :transformedContent,
            wordCount : transformedContentWordCount,
            message: "Content Academized successfully",
        });
    } catch (error) {
         console.error("Error while transforming content to Academics:", error);
            return NextResponse.json(
                { success: false, message: "Error generating Academics content" },
                { status: 500 }
        );
    }
}