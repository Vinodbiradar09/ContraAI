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
      "Transform your content into authentic, natural-sounding, human-like text that deeply engages your readers effortlessly. Great for conversational, casual, and friendly tones tailored to your audience.",
    route: "/humanizeclient",
    colors: ["#7f53ac", "#647dee"],
    borderColor: "rgba(127, 83, 172, 0.8)",
  },
  {
    key: "refine",
    title: "Refine Mode AI",
    description:
      "Polish your writing with expert-level refinement improving clarity, professionalism, and flow. Ideal for technical documents, corporate messaging, and complex narratives.",
    route: "/refineclient",
    colors: ["#709d8e", "#40514e"],
    borderColor: "rgba(112, 157, 142, 0.8)",
  },
  {
    key: "concise",
    title: "Concise Mode AI",
    description:
      "Compress verbose content into short, impactful, clear writing without losing core meaning. Perfect for executive summaries, abstracts, and quick communications.",
    route: "/conciseclient",
    colors: ["#b08ea2", "#704a5e"],
    borderColor: "rgba(176, 142, 162, 0.8)",
  },
  {
    key: "academics",
    title: "Academics Mode AI",
    description:
      "Generate sophisticated academic style content with precise terminology and formal tone. Excellent for research papers, theses, and scholarly articles requiring depth and rigor.",
    route: "/academicsclient",
    colors: ["#4b6f8a", "#2f4550"],
    borderColor: "rgba(75, 111, 138, 0.8)",
  },
];

const cardVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow:
      "0 0 15px 3px rgba(127, 83, 172, 0.8), 0 15px 30px rgba(50, 50, 93, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2)",
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
          <h2 className="text-3xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 text-lg tracking-wide">
            Please login to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pulse-border {
          0%, 100% {
            box-shadow:
              0 0 10px 2px rgba(255,255,255,0.15),
              0 0 15px 5px rgba(255,255,255,0.1);
          }
          50% {
            box-shadow:
              0 0 15px 4px rgba(255,255,255,0.4),
              0 0 25px 10px rgba(255,255,255,0.3);
          }
        }
      `}</style>
      <main className="min-h-screen bg-black flex flex-col items-center py-12 px-4 sm:px-8 md:px-12 lg:px-20">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#7f53ac] via-[#647dee] to-[#4b6f8a] mb-14 text-center max-w-xl select-none px-4">
          Choose Your AI Mode
        </h1>

        <div className="grid w-full max-w-7xl grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-12 sm:gap-16">
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
              onKeyDown={(e) => (e.key === "Enter" ? handleNavigate(route) : undefined)}
              className={`cursor-pointer relative rounded-3xl p-10 bg-gradient-to-br from-[${colors[0]}] to-[${colors[1]}]
                text-white flex flex-col justify-between ring-1 ring-white/10 ring-inset transition-transform
                focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-black focus:ring-opacity-60 hover:brightness-110`}
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "transparent",
                animation: "pulse-border 4s ease-in-out infinite",
                minHeight: "320px", // minimum height for good card balance on small screens
              }}
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md mb-5 select-none">
                  {title}
                </h2>
                <p className="text-white/90 leading-relaxed max-w-lg font-light text-base sm:text-lg">
                  {description}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate(route);
                }}
                aria-label={`Enter ${title}`}
                className="mt-12 self-start rounded-lg text-lg font-semibold px-8 py-3 border-b-4 border-white/70 bg-white/15 text-white backdrop-blur-sm shadow-lg hover:bg-white/25 hover:border-white/90 transition cursor-pointer select-none"
              >
                Enter {title.split(" ")[0]}
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
}
