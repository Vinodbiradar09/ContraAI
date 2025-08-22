import {z} from "zod";

export const contentValidation = z.object({
    originalContent : z.string().min(10 , {message : "The content must be atleast 10 chars"}).max(5000 , {message : "The content cannot exceed more than 5000 chars"}),
    originalWordCount : z.number().min(0 , {message : "original content word count can't be less than 0"}),
});

