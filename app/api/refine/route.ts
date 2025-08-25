import { connectDB } from "@/app/lib/db";
import UserM from "@/app/model/Users";
import { perplexityApiCallRefine } from "@/app/helpers/perplexityRefine";
import { countWords } from "@/app/helpers/wordsCount";
import { currentUser } from "@/app/helpers/currentUser";
import { NextRequest , NextResponse } from "next/server";
import Transformed from "@/app/model/Transformation";
import { contentValidation } from "@/app/schemas/TransformContent.Schema";
import { sanitizeInput } from "@/app/helpers/wordsCount";

export async function POST(request : NextRequest) {
    try {
        await connectDB();
        const user = await currentUser();
        if(!user){
            return NextResponse.json(
                {
                    message : "Unauthorized User , Please login",
                    success : false,
                }, {status : 401}
            )
        }
        const { originalContent } = await request.json();
        if(!originalContent || typeof originalContent !== 'string'){
            return NextResponse.json(
                {
                    message : "Content is required to generate the refined version of content",
                    success : false,
                }, {status : 400}
            )
        }
        const originalWordCount = countWords(originalContent);
        const validation = contentValidation.safeParse({originalContent , originalWordCount});
        if(!validation.success){
            const formattedErrors = validation.error.format();
            const errors = [
                 ...(formattedErrors.originalContent?._errors || []),
                ...(formattedErrors.originalWordCount?._errors || []),
            ]
            return NextResponse.json(
                {
                    message : errors.length > 0 ? errors.join(', ') : "Content must be provided and have at least 10 characters",
                    success : false,
                }, {status : 402}
            )
        }

        const sanitizedOriginalRefineContent = sanitizeInput(originalContent);
        const transformedRefineContent = await perplexityApiCallRefine(sanitizedOriginalRefineContent);
        if(!transformedRefineContent){
             return NextResponse.json(
                { message: "Failed to generate transformed Refine content", success: false },
                { status: 500 }
            );
        }

        const transformedRefineWordCount = countWords(transformedRefineContent);

        const loggedUser = await UserM.findById(user.id);
        if(!loggedUser){
             return NextResponse.json(
                { message: "User not found", success: false },
                { status: 404 }
            );
        }

        const transformedRefineDoc = await Transformed.create({
            userId : loggedUser._id,
            mode : "refine",
            originalContent : sanitizedOriginalRefineContent,
            transformedContent : transformedRefineContent,
            originalWordCount : originalWordCount,
            transformedWordCount : transformedRefineWordCount,
        })

        if (!transformedRefineDoc) {
            return NextResponse.json(
                { message: "Failed to save the Refined content", success: false },
                { status: 500 }
            );
        }   

        return NextResponse.json({
        success: true,
        content : transformedRefineContent,
        wordCount : transformedRefineWordCount,
        message: "Content Refined successfully",
    });
    } catch (error) {
        console.error("Error while transforming content to Refining content:", error);
        return NextResponse.json(
            { success: false, message: "Error generating Refining content" },
            { status: 500 }
        );
    }
}
