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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
   
      <motion.div
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(150% at 50% 50%)" }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,_#ff00cc,_#333,rgba(255,255,255,0))] animate-rainbow"
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-3xl bg-black bg-opacity-80 border border-purple-600 shadow-[0_0_20px_6px_rgba(204,21,202,0.8)] backdrop-blur-md"
      >
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-700 mb-10 text-center">
          Create your <span className="text-purple-400">ContraAI</span> Account
        </h1>

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
              } focus:outline-none focus:ring-2 focus:ring-purple-600`}
            />
            <p className="mt-1 text-sm text-center min-h-[1rem]">
              {isCheckingUsername
                ? <span className="text-purple-400 animate-pulse">Checking availability...</span>
                : (usernameMessage ? (
                    <span className={usernameMessage.toLowerCase().includes("available") ? "text-green-500" : "text-red-500"}>
                      {usernameMessage}
                    </span>
                  ) : <span className="invisible">&nbsp;</span>)
              }
            </p>
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
            )}
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
              } focus:outline-none focus:ring-2 focus:ring-purple-600`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
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
              } focus:outline-none focus:ring-2 focus:ring-purple-600`}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-11 right-3 text-purple-400 hover:text-purple-200 cursor-pointer transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

        
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white text-lg font-semibold shadow-lg hover:shadow-pink-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

     
        <p className="mt-10 text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-pink-500 hover:underline">
            Sign In
          </Link>
        </p>

      <style jsx global>{`
        @keyframes rainbow {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }
        .bg-[radial-gradient] {
          background: radial-gradient(circle at center, #ff00cc, #333, transparent);
          animation: rainbow 20s linear infinite;
        }
      `}</style>
      </motion.div>
    </div>
  );
}
