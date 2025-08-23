import { connectDB } from "@/app/lib/db";
import UserM from "@/app/model/Users";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/app/helpers/currentUser";
import { contentValidation } from "@/app/schemas/TransformContent.Schema";
import { countWords } from "@/app/helpers/wordsCount";
import { sanitizeInput } from "@/app/helpers/wordsCount";
import { perplexityApiCall } from "@/app/helpers/perplexityHumanize";
import Transformed from "@/app/model/Transformation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized User, please login", success: false },
        { status: 401 }
      );
    }

    const { originalContent } = await request.json();
    if (!originalContent || typeof originalContent !== "string") {
      return NextResponse.json(
        { message: "Content is required to humanize it", success: false },
        { status: 400 }
      );
    }

    const originalWordCount = countWords(originalContent);
    const validation = contentValidation.safeParse({ originalContent, originalWordCount });
    if (!validation.success) {
      const formattedErrors = validation.error.format();
      const errors = [
        ...(formattedErrors.originalContent?._errors || []),
        ...(formattedErrors.originalWordCount?._errors || []),
      ];
      return NextResponse.json(
        {
          message:
            errors.length > 0
              ? errors.join(", ")
              : "Content must be provided and have at least 10 characters",
          success: false,
        },
        { status: 422 }
      );
    }

    const sanitizedOriginalContent = sanitizeInput(originalContent);

    const transformedContent = await perplexityApiCall(sanitizedOriginalContent);
    if (!transformedContent) {
      return NextResponse.json(
        { message: "Failed to generate transformed humanized content", success: false },
        { status: 500 }
      );
    }

    const transformedContentWordCount = countWords(transformedContent);

    const loggedUser = await UserM.findById(user.id);
    if (!loggedUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const transformedDoc = await Transformed.create({
      userId: loggedUser._id,
      mode: "humanize",
      originalContent: sanitizedOriginalContent,
      transformedContent,
      originalWordCount,
      transformedWordCount: transformedContentWordCount,
    });

    if (!transformedDoc) {
      return NextResponse.json(
        { message: "Failed to save the humanized content", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transformedContent,
      message: "Content humanized successfully",
    });
  } catch (error) {
    console.error("Error while transforming content to humanize:", error);
    return NextResponse.json(
      { success: false, message: "Error generating humanized content" },
      { status: 500 }
    );
  }
}
