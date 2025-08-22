import { z } from "zod";

export const usernameValidation = z.string()
  .min(2 , "username must be atleast 2 chars ")
  .max(20 ,"username must not exceed 20 chars")
  .regex(
    /^(?!.*\.\.)(?!.*\.$)(?!\.)([A-Za-z0-9._]{1,30})$/,
    "username must not contain special symbol and must not start or end with the dot ."
)

export const signUpValidation = z.object({
    username : usernameValidation,
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6 , {message : "Password must be atleast six characters"})
})

export const verifyCodeValidation = z.object({
    verifyCode : z.string().length(6 , {message : "Verification code must six digits"}),

})


export const signInValidation = z.object({
    email : z.string().email({message : "Invalid email address"}),
    password : z.string(),
})
