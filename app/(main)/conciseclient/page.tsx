"use client";
import React, { useEffect } from "react";
import ModeEditor from "@/components/ModeEditor";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function ConcisePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user) {
      router.replace("/sign-in");
      return;
    }
  }, [session, router, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <p className="text-gray-300 text-lg font-semibold animate-pulse">
          Checking Authentication...
        </p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-200 mb-3">
            Authentication Required
          </h2>
          <p className="text-gray-400 text-base">
            Please login to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-black flex flex-col items-center px-6 py-6 sm:py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Title */}
      <div className="text-center mb-8">
        <motion.h1
          className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent
                     bg-gradient-to-r from-gray-200 via-white to-gray-400 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: -10 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          Concise Mode AI
        </motion.h1>

        {/* Silver underline animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 1.05, 1] }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="h-[2px] mt-2 rounded-full bg-gradient-to-r from-gray-200 via-white to-gray-400 mx-auto w-1/2 origin-left"
        />
      </div>

      {/* Mode Editor */}
      <div className="w-full max-w-7xl">
        <ModeEditor
          mode="concise"
          apiEndpoint="/api/concise"
          inputPlaceholder="Paste content to concise..."
        />
      </div>
    </motion.div>
  );
}
