import { connectDB } from "@/app/lib/db";
import UserM from "@/app/model/Users";
import { NextRequest , NextResponse } from "next/server";
import { currentUser } from "@/app/helpers/currentUser";
import { contentValidation } from "@/app/schemas/TransformContent.Schema";
import { countWords } from "@/app/helpers/wordsCount";
import { sanitizeInput } from "@/app/helpers/wordsCount";
import { perplexityApiCall } from "@/app/helpers/perplexity";
import Transformed from "@/app/model/Transformation";

export async function POST(request : NextRequest) {
    try {
        await connectDB();
        const user = await currentUser();
        if(!user){
            return NextResponse.json(
                {
                    message : "Unauthorized User , please login",
                    success : false,
                }, {status : 400}
            )
        }

        const {originalContent} = await request.json();
        if(!originalContent){
            return NextResponse.json(
                {
                    message : "Content is required to humanize it",
                    success : false,
                }, {status : 402}
            )
        }
        const originalWordCount = countWords(originalContent);
        const originalContentResult = contentValidation.safeParse({originalContent , originalWordCount});
        if(!originalContentResult.success){
            const formattedErrors = originalContentResult.error.format();
            const originalContentErrors = [
                ...formattedErrors.originalContent?._errors || [],
                ...formattedErrors.originalWordCount?._errors || [],
            ]

            return NextResponse.json(
                {
                    message : originalContentErrors.length > 0 ? originalContentErrors.join(", ") : "Content is required and must be greater than 10 characters",
                    success : false,
                }, {status : 402}
            )
        }

        const sanitizedOriginalContent = sanitizeInput(originalContent);
        const transformedContent = await perplexityApiCall(sanitizedOriginalContent);
        if(!transformedContent){
            return NextResponse.json(
                {
                    message : "Failed to generate the transformed humanized content",
                    success : false,
                }, {status : 400}
            )
        }
        const transformedContentWordCount = countWords(transformedContent);
        const loggedUser = await UserM.findById(user.id);
        if(!loggedUser){
            return NextResponse.json(
                {
                    message : "User not found",
                    success : false,
                }, {status : 404}
            )
        }
        const transformed = await Transformed.create({
            userId : loggedUser._id,
            mode : "humanize",
            originalContent : sanitizedOriginalContent,
            transformedContent,
            originalWordCount ,
            transformedWordCount : transformedContentWordCount,
        })

        if(!transformed){
            return NextResponse.json(
                {
                    message : "Failed to create the instances of the Humanized chat",
                    success : false,
                }, {status : 404}
            )
        }
        return NextResponse.json({ transformedContent });

    } catch (error) {
        console.error("Error while transforming the content to humanize" , error);
        return NextResponse.json(
            {
                message : "Error generating the humanized content",
                success : false
            }, {status : 500}
        )
    }
}