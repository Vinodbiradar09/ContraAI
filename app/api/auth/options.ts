  import CredentialsProvider from "next-auth/providers/credentials";
  import { connectDB } from "@/app/lib/db";
  import bcrypt from "bcrypt";
  import UserModel from "@/app/model/Users";
  import { NextAuthOptions } from "next-auth";
  import { User } from "next-auth";
  export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            name : "Credentials",

            credentials : {
                email : {label : "Email" , type : "text" , placeholder : "Email"},
                password : {label : "Password" , type : "password" , placeholder : "Password"}
            },

            async authorize(credentials) : Promise< User | null > {
                if(!credentials?.email || !credentials.password){
                    throw new Error("Email and Password are required");
                }
                await connectDB();
                try {
                    const user = await UserModel.findOne({email : credentials.email});
                if(!user){
                    throw new Error("User not found");
                }
                if(!user.isVerified){
                    throw new Error("Please verify your account , before login")
                }
                const validPassword = await bcrypt.compare(credentials.password , user.password);
                if(!validPassword){
                    throw new Error(" Invalid Password")
                }
                if(user){
                    return user
                } else {
                    return null
                }
                } catch (error : any) {
                    throw new Error(error || "Authorization Error")
                }
            },
        })
    ],

        callbacks : {
            async jwt({token , user}) {
                if(user){
                    token.id = user.id
                    token.email = user.email
                    token.isVerified = user.isVerified
                    token.username = user.username
                }
                return token;
            },
            async session({token , session}) {
                if(token){
                    session.user.id = token.id
                    session.user.email = token.email
                    session.user.isVerified = token.isVerified
                    session.user.username = token.username 
                }
                return session
            },
        },
        pages : {
            signIn : "/sign-in"
        },
        session : {
            strategy : "jwt"
        },
        secret : process.env.NEXTAUTH_SECRET,
  }