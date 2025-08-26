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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "username" && value.username) {
        setUsername(value.username);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!username) {
      setUsernameMessage("");
      return;
    }
    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const res = await axios.get<ApiRes>(`/api/username-uniqueness?username=${username}`);
        if (res.data.success) {
          setUsernameMessage(res.data.message);
        } else {
          setUsernameMessage(res.data.message || "Username is taken");
        }
      } catch {
        setUsernameMessage("Error checking username.");
      }
      setIsCheckingUsername(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  async function onSubmit(data: SignUpInput) {
    try {
      const res = await axios.post<ApiRes>("/api/sign-up", data);
      if (res.data.success) {
        toast.success(res.data.message, {
          description: "Please verify your account by email.",
          action: {
            label: "Got it",
            onClick: () => console.log("Acknowledged"),
          },
        });
        router.push(`/verify/${data.username}`);
      } else {
        toast.error(res.data.message || "Registration failed.");
      }
    } catch (error) {
      const err = error as AxiosError<ApiRes>;
      toast.error(err.response?.data.message || "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-md w-full bg-[#101010] p-10 rounded-3xl border border-gray-900 shadow-[0_0_20px_2px_rgba(37,99,235,0.5)]"
      >
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center tracking-tight">
          Create your <span className="text-blue-500">ContraAI</span> Account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
          <div>
            <label htmlFor="username" className="block mb-2 text-gray-400 font-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="off"
              className={`w-full p-4 rounded-lg border ${
                errors.username ? "border-red-600" : "border-gray-700"
              } bg-black text-white placeholder-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-700 transition`}
              placeholder="Choose your username"
              {...register("username")}
            />
            <div className="mt-1 min-h-[1.25rem] text-sm">
              {isCheckingUsername ? (
                <span className="text-blue-400">Checking availability...</span>
              ) : usernameMessage ? (
                usernameMessage.toLowerCase().includes("available") ? (
                  <span className="text-green-400">{usernameMessage}</span>
                ) : (
                  <span className="text-red-500">{usernameMessage}</span>
                )
              ) : (
                <span className="invisible">Placeholder</span>
              )}
            </div>
            {errors.username && (
              <p className="mt-1 text-red-600 text-sm">{errors.username.message}</p>
            )}
          </div>
       
          <div>
            <label htmlFor="email" className="block mb-2 text-gray-400 font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="off"
              className={`w-full p-4 rounded-lg border ${
                errors.email ? "border-red-600" : "border-gray-700"
              } bg-black text-white placeholder-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-700 transition`}
              placeholder="Your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>
       
          <div className="relative">
            <label htmlFor="password" className="block mb-2 text-gray-400 font-semibold">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              className={`w-full p-4 rounded-lg border ${
                errors.password ? "border-red-600" : "border-gray-700"
              } bg-black text-white placeholder-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-700 transition`}
              placeholder="Create your password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-13 text-gray-500 hover:text-gray-300 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
