'use client'
import React, { useState } from 'react'
import { signInValidation } from '@/app/schemas/User.Schema'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from "framer-motion"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

const SignInForm = () => {
    const router = useRouter();
    const [isLoading , setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const form = useForm<z.infer<typeof signInValidation>>({
        resolver : zodResolver(signInValidation),
        defaultValues : {
            email : "",
            password : "",
        }
    });

    const onSubmit = async (data : z.infer<typeof signInValidation>)=>{
        setIsLoading(true);
        const result = await signIn("credentials" , {
            redirect : false,
            email : data.email,
            password : data.password
        });

        if(result?.error){
            if(result.error === "Error:  Invalid Password"){
                toast("Invalid email or password", {
                    description: "Please try again with the correct credentials.",
                    action : {
                        label : "Got it",
                        onClick : ()=> console.log("Undo happend"),
                    }
                })
            } else {
                toast(result.error || "Login failed")
            }
        }

        if(result?.url){
            toast("Successfully Signed In", {
                description : "Redirected you to the dashboard...",
                action : {
                    label : "Got it",
                    onClick : ()=> console.log("Undo Happend"),
                }
            })
            router.replace("/dashboard");
        }
        setIsLoading(false)
    }

    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4">
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,_#9333ea,_#111,transparent)]"
        />

      
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md p-10 rounded-3xl
                     bg-black bg-opacity-80 border border-purple-600 
                     shadow-[0_0_20px_6px_rgba(147,51,234,0.6)] backdrop-blur-md"
        >
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold text-center bg-clip-text 
                       text-transparent bg-gradient-to-r from-pink-400 to-purple-600 mb-10"
          >
            Welcome Back To ContraAI
          </motion.h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
           
              <FormField
                name='email'
                control={form.control}
                render={({field})=> (
                    <FormItem>
                        <FormLabel className='text-gray-300 font-semibold'>Email</FormLabel>
                        <FormControl>
                            <Input  
                              placeholder='Enter your email'
                              type='email'
                              className="bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-500 rounded-md px-3 py-3 focus:ring-2 focus:ring-purple-500 transition"
                              {...field} 
                            />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm"/>
                    </FormItem>
                )}
              />

           
              <FormField
                name='password'
                control={form.control}
                render={({field})=> (
                    <FormItem>
                        <FormLabel className='text-gray-300 font-semibold'>Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                              <Input  
                                placeholder='Enter your password'
                                type={showPassword ? "text" : "password"}
                                className="bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-500 rounded-md px-3 py-3 focus:ring-2 focus:ring-pink-500 transition w-full"
                                {...field}
                              />
                              <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                              </button>
                            </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm"/>
                    </FormItem>
                )}
              />

            
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500
                             text-white text-lg font-semibold shadow-lg hover:shadow-purple-700 transition disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>
            </form>
          </Form>

       
          <p className="mt-8 text-center text-gray-400">
            Don’t have an account?{" "}
            <Link href="/sign-up" className="text-pink-500 hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    )
}

export default SignInForm
