import { NextRequest , NextResponse } from "next/server";
import { currentUser } from "@/app/helpers/currentUser";
import Transformed from "@/app/model/Transformation";
import UserM from "@/app/model/Users";
import { connectDB } from "@/app/lib/db";
import { perplexityApiCallConcise } from "@/app/helpers/perplexityConcise";
import { contentValidation } from "@/app/schemas/TransformContent.Schema";
import { countWords } from "@/app/helpers/wordsCount";
import { sanitizeInput } from "@/app/helpers/wordsCount";

export async function POST(request : NextRequest) {
    try {
        await connectDB();
        const {originalContent} = await request.json();
        if(!originalContent || typeof originalContent !== "string"){
            return NextResponse.json(
                {
                    message : "Content is required to generate the , concise version content",
                    success : false,
                }, {status : 400}
            )
        }
        const user = await currentUser();
        if(!user){
            return NextResponse.json(
                {
                    message : "Unauthorized User , please login",
                }, {status : 401}
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
                    message : errors.length > 0 ? errors.join(', ') : "Content must be provided atleast 50 chars",
                    success : false
                } , {status : 402}
            )
        }
        const sanitizedOriginalConciseContent = sanitizeInput(originalContent);
        const transformedConciseContent = await perplexityApiCallConcise(sanitizedOriginalConciseContent);

        if(!transformedConciseContent){
            return NextResponse.json(
                {
                    message : "Failed to generate the Concise Content",
                    success : false,
                }, {status : 404}
            )
        }

        const transformedConciseWordCount = countWords(transformedConciseContent);

        const loggedUser = await UserM.findById(user.id);
        if(!loggedUser){
            return NextResponse.json(
                {
                    message : "Logged User not found",
                    success : false,
                }, {status : 404}
            )
        }

        const transformedConciseDoc = await Transformed.create({
            userId : loggedUser._id,
            mode : "concise",
            originalContent : sanitizedOriginalConciseContent,
            transformedContent : transformedConciseContent,
            originalWordCount : originalWordCount,
            transformedWordCount : transformedConciseWordCount,
        })

        if(!transformedConciseDoc){
            return NextResponse.json(
                {
                    message : "Failed to Create a Concised content",
                    success : false,
                }, {status : 404}
            )
        }

        return NextResponse.json(
            {
                content : transformedConciseContent,
                wordCount : transformedConciseWordCount,
                message : "Successfully Concise Content has been created",
                success : true,
            }, {status : 200}
        )
    } catch (error) {
        console.error("Error while transforming content to Concise content:", error);
        return NextResponse.json(
            { success: false, message: "Error generating Concise content" },
            { status: 500 }
        );
    }
}