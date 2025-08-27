"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useSession } from "next-auth/react";

const dashboardModes = [
  {
    key: "humanize",
    title: "Humanize Mode AI",
    description:
      "Transform your content into authentic, natural-sounding, human-like text that deeply engages your readers effortlessly.",
    route: "/humanizeclient",
    colors: ["#7f53ac", "#647dee"],
  },
  {
    key: "refine",
    title: "Refine Mode AI",
    description:
      "Polish your writing with expert-level refinement improving clarity, professionalism, and flow.",
    route: "/refineclient",
    colors: ["#709d8e", "#40514e"],
  },
  {
    key: "concise",
    title: "Concise Mode AI",
    description:
      "Compress verbose content into short, impactful, clear writing without losing core meaning.",
    route: "/conciseclient",
    colors: ["#b08ea2", "#704a5e"],
  },
  {
    key: "academics",
    title: "Academics Mode AI",
    description:
      "Generate sophisticated academic style content with precise terminology and formal tone.",
    route: "/academicsclient",
    colors: ["#4b6f8a", "#2f4550"],
  },
];

const cardVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow:
      "0 0 25px rgba(255,255,255,0.15), 0 8px 25px rgba(0,0,0,0.4)",
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user) {
      router.replace("/sign-in");
      return;
    }
  }, [router, session, status]);

  function handleNavigate(route: string) {
    router.push(route);
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl font-semibold tracking-wide animate-pulse">
          Checking Authentication...
        </p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-400 text-lg tracking-wide">
            Please login to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center py-12 px-4 sm:px-8 lg:px-16 overflow-hidden">
    
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent"
          animate={{ x: ["-50%", "30%", "120%"] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </motion.div>

    
      <div className="relative z-10 text-center mb-14">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent
                     bg-gradient-to-r from-gray-200 via-white to-gray-400 select-none"
        >
          Choose Your AI Mode
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1.05, 1], opacity: [0, 1, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 6,
            ease: "easeInOut",
          }}
          className="h-[2px] mt-3 rounded-full bg-gradient-to-r from-gray-300 via-white to-gray-400 mx-auto w-1/3 origin-left"
        />
      </div>

   
      <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 sm:gap-14">
        {dashboardModes.map(({ key, title, description, route, colors }) => (
          <motion.div
            key={key}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            onClick={() => handleNavigate(route)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" ? handleNavigate(route) : undefined
            }
            className={`cursor-pointer relative rounded-3xl p-10 flex flex-col justify-between transition-transform`}
            style={{
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              border: "1px solid rgba(255,255,255,0.2)",
              minHeight: "300px",
            }}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 select-none">
                {title}
              </h2>
              <p className="text-white/90 leading-relaxed font-light text-sm sm:text-base">
                {description}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate(route);
              }}
              aria-label={`Enter ${title}`}
              className="mt-10 self-start rounded-md text-base sm:text-lg font-semibold px-6 py-3 border-b-2 border-white/60 bg-white/10 text-white backdrop-blur-sm shadow-md hover:bg-white/20 hover:border-white/90 transition"
            >
              Enter {title.split(" ")[0]}
            </button>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
