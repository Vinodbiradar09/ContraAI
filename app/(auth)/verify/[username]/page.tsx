"use client"
import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ApiRes } from '@/app/types/ApiResponse'
import { verifyCodeValidation } from '@/app/schemas/User.Schema'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from "framer-motion"

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof verifyCodeValidation>>({
    resolver: zodResolver(verifyCodeValidation),
    defaultValues: {
      verifyCode: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof verifyCodeValidation>) => {
    setIsLoading(true);
    try {
      const res = await axios.post<ApiRes>("/api/verify-code", {
        username: params.username,
        verifyCode: data.verifyCode,
      });
      if (res.data.success === true) {
        toast("Verification successful", {
          description: "You can now log in to your account.",
          action: {
            label: "Got it",
            onClick: () => console.log("Undo happend"),
          }
        });
      } else {
        toast(res.data.message);
      }
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiRes>;
      toast(
        axiosError.response?.data.message ??
        "An error occurred. Please try again.",{
            description : "Try Again , After Sometime",
            action : {
                label : "Got it",
                onClick : ()=> console.log("Undo happend"),
            }
        }
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ filter: "hue-rotate(0deg)" }}
        animate={{ filter: "hue-rotate(360deg)" }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity
        }}
        className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,_#4c1d95,_#111,transparent)]"
      />

     
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-3xl
                   bg-black bg-opacity-80 border border-blue-700
                   shadow-[0_0_20px_6px_rgba(59,130,246,0.7)] backdrop-blur-md"
      >
      
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-4xl font-extrabold text-center bg-clip-text text-transparent
                     bg-gradient-to-r from-blue-400 to-purple-600"
        >
          Verify Your ContraAI Account
        </motion.h1>

       
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-semibold">Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter verification code"
                      className="bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md bg-gradient-to-r from-blue-600 via-purple-600 to-purple-500
                         text-white text-lg font-semibold shadow-lg hover:shadow-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Verifying Code..." : "Verify"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  )
}

export default VerifyAccount
