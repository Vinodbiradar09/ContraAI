"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { ApiRes } from "@/app/types/ApiResponse";
import { Eye, EyeOff } from "lucide-react";

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignUpInput = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "username") {
        setUsername(value.username || "");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!username) {
      setUsernameMessage("");
      return;
    }
    const timer = setTimeout(() => {
      (async () => {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const res = await axios.get<ApiRes>(`/api/username-uniqueness?username=${username}`);
          if (res.data.success) setUsernameMessage(res.data.message);
          else setUsernameMessage(res.data.message || "Username is taken");
        } catch {
          setUsernameMessage("Error checking username.");
        }
        setIsCheckingUsername(false);
      })();
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  async function onSubmit(data: SignUpInput) {
    try {
      const res = await axios.post<ApiRes>("/api/sign-up", data);
      if (res.data.success) {
        toast(res.data.message, {
          description: "Please verify your account by email.",
          action: { label: "Got it", onClick: () => console.log("Acknowledged") },
        });
        router.push(`/verify/${data.username}`);
      } else {
        toast(res.data.message || "Registration failed.", {
          description: "Your Registration Has Been Failed Due To Server Error",
          action: { label: "Got it", onClick: () => console.log("Acknowledged") },
        });
      }
    } catch (error) {
      const err = error as AxiosError<ApiRes>;
      toast.error(err.response?.data.message || "Something went wrong.");
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-4">
      
    
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
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
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-3xl 
                   bg-black bg-opacity-80 border border-gray-700 
                   shadow-[0_0_30px_5px_rgba(255,255,255,0.1)] backdrop-blur-xl"
      >
     
        <div className="relative text-center mb-10">
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text
                       bg-gradient-to-r from-gray-200 via-white to-gray-400"
          >
            Create your ContraAI Account
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
            className="h-[2px] mt-2 rounded-full bg-gradient-to-r from-gray-200 via-white to-gray-400 mx-auto w-1/2 origin-left"
          />
        </div>

     
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
          <div>
            <label htmlFor="username" className="block mb-1 text-gray-300 font-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              placeholder="Choose your username"
              autoComplete="off"
              className={`w-full rounded-md bg-black text-white placeholder-gray-500 p-3 border transition ${
                errors.username ? "border-red-600" : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-gray-400`}
            />
            <p className="mt-1 text-sm text-center min-h-[1rem]">
              {isCheckingUsername
                ? <span className="text-gray-300 animate-pulse">Checking availability...</span>
                : (usernameMessage ? (
                    <span className={usernameMessage.toLowerCase().includes("available") ? "text-green-500" : "text-red-500"}>
                      {usernameMessage}
                    </span>
                  ) : <span className="invisible">&nbsp;</span>)
              }
            </p>
            {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
          </div>

    
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-300 font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Your email"
              autoComplete="off"
              className={`w-full rounded-md bg-black text-white placeholder-gray-500 p-3 border transition ${
                errors.email ? "border-red-600" : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-gray-400`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

        
          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-gray-300 font-semibold">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Create your password"
              autoComplete="off"
              className={`w-full rounded-md bg-black text-white placeholder-gray-500 p-3 border transition ${
                errors.password ? "border-red-600" : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-gray-400`}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-11 right-3 text-gray-400 hover:text-gray-200 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

      
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-md bg-[#111111] border border-gray-700
                         text-white text-lg font-semibold shadow-md 
                         hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] 
                         transition disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </motion.div>
        </form>

     
        <p className="mt-10 text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-gray-300 hover:text-white underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
