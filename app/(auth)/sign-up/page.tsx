'use client'
import React, { useState , useEffect} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signUpValidation } from '@/app/schemas/User.Schema'
import { ApiRes } from '@/app/types/ApiResponse'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios , {AxiosError} from "axios";
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const SignUpForm = () => {
    const router = useRouter();
    const [isSubmitting , setIsSubmitting] = useState<boolean>(false);
    const [username , setUsername] = useState<string | null>('');
    const [usernameMessage , setUsernameMessage] = useState<string>('');
    const [isCheckingUsername , setIsCheckingUsername] = useState<boolean>(false);
    const [showPassword , setShowPassword] = useState<boolean>(false);
    const debounced = useDebounceCallback(setUsername , 500);

    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver : zodResolver(signUpValidation),
        defaultValues : {
            username : "",
            email : "",
            password : "",
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async ()=>{
            if(username){
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const res = await axios.get<ApiRes>(`/api/username-uniqueness?username=${username}`);
                    if(res.data.success === true){
                        setUsernameMessage(res.data.message);
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<ApiRes>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error while checking the username unique"); 
                } finally{
                    setIsCheckingUsername(false);
                }
            }
        }

        checkUsernameUnique();
    }, [username])
    
    const onSubmit = async(data : z.infer<typeof signUpValidation>)=>{
        try {
            setIsSubmitting(true);
            const res = await axios.post<ApiRes>("/api/sign-up" , data);
            if(res.data.success === true){
               toast(res.data.message,{
                description : "Have A Good Time Babe's",
                action : {
                    label : "F*ck pop-up",
                    onClick : ()=> console.log("undo happend")
                }
               })
            } else {
                toast.error(res.data.message || "Error while registering");
            }
            router.replace(`/verify/${username}`);
        } catch (error) {
            console.error("Error occurred while submit the form", error);
            const axiosError = error as AxiosError<ApiRes>;
            const errorMessage = axiosError.response?.data.message;
            toast.error(errorMessage);
        } finally{
            setIsSubmitting(false);
        }
    }

  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField 
                name='username'
                control={form.control}
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder='Choose your username' {...field}  onChange={(e)=> {field.onChange(e); debounced(e.target.value)}}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField 
                name='email'
                control={form.control}
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder='Choose your Email' {...field} type='email' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField 
                name='password'
                control={form.control}
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder='Choose your Password' {...field} type='password'/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                       <div>
                          Creating your account...
                       </div>
                    ) : ( 
                        <div>
                            create account
                        </div>
                    )}
                </Button>
            </form>
        </Form>
    </div>
  )
}

export default SignUpForm
