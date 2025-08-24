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

const SignInForm = () => {

    const router = useRouter();
    const [isLoading , setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof signInValidation>>({
        resolver : zodResolver(signInValidation),
        defaultValues : {
            email : "",
            password : "",
        }
    })

    const onSubmit = async (data : z.infer<typeof signInValidation>)=>{
        setIsLoading(true);
        const result = await signIn("credentials" , {
            redirect : false,
            email : data.email,
            password : data.password
        });

        if(result?.error){
            if(result.error === "CredentialsSignin"){
                toast.error("Login failed , Invalid password or email")
            } else {
                console.log("login error")
                toast.error(result.error)
            }
        }

        if(result?.url){
            toast("Babe ♥️ You Have Successfully Logged In" , {
                description : "Now Transform Your Content Using Multiple Modes",
                action : {
                    label : "F*ck pop-up",
                    onClick : ()=> console.log("Undo successed")
                }
            })
            router.replace("/dashboard");
        }

        setIsLoading(false)
    }

  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField 
                name='email'
                control={form.control}
                render={({field})=> (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input  placeholder='Email' type='email'{...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField 
                name='password'
                control={form.control}
                render={({field})=> (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input  placeholder='Password' type='password' {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type='submit'>
                    {
                        isLoading ? (
                            <div>
                                Signing in...
                            </div>
                        ) : (
                            <div>
                                Sign In
                            </div>
                        )
                    }
                </Button>
            </form>
        </Form>
    </div>
  )
}

export default SignInForm
