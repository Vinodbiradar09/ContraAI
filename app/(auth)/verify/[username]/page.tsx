"use client"
import React, { useState } from 'react'
import { useRouter  , useParams} from 'next/navigation'
import { ApiRes } from '@/app/types/ApiResponse'
import { verifyCodeValidation } from '@/app/schemas/User.Schema'
import * as z from 'zod'
import axios , {AxiosError} from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{username : string}>();
    const [isLoading , setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof verifyCodeValidation>>({
        resolver : zodResolver(verifyCodeValidation),
        defaultValues : {
            verifyCode : ""
        }
    });

    const onSubmit = async(data : z.infer<typeof verifyCodeValidation>)=>{
        setIsLoading(true);
        try {
            const res = await axios.post<ApiRes>("/api/verify-code" , {
                username : params.username,
                verifyCode : data.verifyCode,
            })
            if(res.data.success === true){
                toast("babe you have successfully verified", {
                    description : "Please login , Becoz you have verified 😁",
                    action : {
                        label : "F*ck pop-up",
                        onClick : ()=> console.log("Pop-up undo")
                        }
                    })
            } else {
                toast(res.data.message)
            }
            router.replace("/sign-in");
        } catch (error) {
            console.error("Error occurred while verifying the code", error);
            const axiosError = error as AxiosError<ApiRes>;
            toast.error(
            axiosError.response?.data.message ??
            "An error occurred. Please try again."
        );
        } finally{
            setIsLoading(false);
        }
    }
  return (
    <div>
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField 
            name='verifyCode'
            control={form.control}
            render={({field})=>(
                <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                        <Input placeholder='verification code' {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <Button type='submit'>
                {isLoading ? (
                    <div>
                        Verifying Code...
                    </div>
                ) : (
                    <div>
                        Verify
                    </div>
                )}
            </Button>
        </form>
     </Form>
    </div>
  )
}

export default VerifyAccount
