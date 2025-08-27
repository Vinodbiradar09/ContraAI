"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 py-16 overflow-hidden">
   
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
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative max-w-4xl text-center z-10"
      >
      
        <div className="inline-block relative overflow-hidden">
          <motion.h1
            className="relative text-5xl sm:text-7xl font-extrabold tracking-tight mb-3 select-none"
            style={{
              background:
                "linear-gradient(to right, #d4d4d4, #f5f5f5, #a3a3a3, #e5e5e5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Contra AI
          </motion.h1>

        
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%", "-100%"] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

       
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1.1, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 6,
              ease: "easeInOut",
            }}
            className="relative h-[3px] mt-1 rounded-full bg-gradient-to-r from-gray-300 via-white to-gray-400 mx-auto origin-left"
          />
        </div>

      
        <motion.p
          className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Transform your content effortlessly with advanced AI-powered tools —
          delivering elegance, clarity, and precision.
        </motion.p>

      
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Link href="/sign-up" passHref legacyBehavior>
            <motion.a
              whileHover={{
                scale: 1.03,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
              }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-xl font-semibold text-white bg-[#111111] border border-gray-700 transition-colors duration-300"
            >
              Get Started
            </motion.a>
          </Link>
          <Link href="/sign-in" passHref legacyBehavior>
            <motion.a
              whileHover={{
                scale: 1.03,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
              }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-xl font-semibold text-gray-400 bg-[#0a0a0a] border border-gray-800 transition-colors duration-300"
            >
              Sign In
            </motion.a>
          </Link>
        </motion.div>

      
        <motion.div
          className="hidden lg:flex justify-center mt-12 text-sm text-gray-600 select-none tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          Powered by 4 intelligent AI modes: Humanize, Refine, Concise, Academics
        </motion.div>
      </motion.div>

    
      <p className="absolute bottom-2 right-4 text-xs text-gray-100/20 select-none">
        Best viewed on desktop or laptop
      </p>
    </main>
  );
}
