"use client"
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
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent"
            animate={{ x: ["-50%", "30%", "120%"] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md p-10 rounded-3xl
                     bg-black bg-opacity-80 border border-gray-700
                     shadow-[0_0_30px_5px_rgba(255,255,255,0.08)] backdrop-blur-xl"
        >
    
          <div className="relative inline-block w-full text-center mb-10">
            <motion.h1
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl font-extrabold text-center select-none
                         bg-clip-text text-transparent
                         bg-gradient-to-r from-gray-200 via-white to-gray-400"
            >
              Welcome Back to ContraAI
            </motion.h1>

         
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1.05, 1],
                opacity: [0, 1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 6,
                ease: "easeInOut",
              }}
              className="h-[2px] mt-2 rounded-full bg-gradient-to-r from-gray-300 via-white to-gray-400 mx-auto w-1/2 origin-left"
            />
          </div>

       
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
                              className="bg-black bg-opacity-50 border border-gray-700 
                                         text-white placeholder-gray-500 rounded-md px-3 py-3 
                                         focus:ring-2 focus:ring-gray-400 transition"
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
                                className="bg-black bg-opacity-50 border border-gray-700 
                                           text-white placeholder-gray-500 rounded-md px-3 py-3 
                                           focus:ring-2 focus:ring-gray-400 transition w-full"
                                {...field}
                              />
                              <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
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
                  className="w-full py-3 rounded-md 
                             bg-[#111111] border border-gray-700
                             text-white text-lg font-semibold 
                             shadow-md hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] 
                             transition disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>
            </form>
          </Form>

        
          <p className="mt-8 text-center text-gray-400">
            Don’t have an account?{" "}
            <Link href="/sign-up" className="text-gray-300 hover:text-white underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    )
}

export default SignInForm
