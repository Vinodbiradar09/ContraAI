"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";


const dashboardModes = [
  {
    key: "humanize",
    title: "Humanize Mode AI",
    description:
      "Transform your content into authentic, natural-sounding, human-like text that deeply engages your readers effortlessly. Great for conversational, casual, and friendly tones perfectly tailored to your audience.",
    route: "/humanizeclient",
  },
  {
    key: "refine",
    title: "Refine Mode AI",
    description:
      "Polish your writing with expert-level refinement that improves clarity, professionalism, and flow. Ideal for enhancing technical documents, corporate messaging, and complex narratives.",
    route: "/refineclient",
  },
  {
    key: "concise",
    title: "Concise Mode AI",
    description:
      "Compress verbose content into short, impactful, clear writing without losing core meaning. Perfect for executive summaries, abstracts, and quick communications.",
    route: "/conciseclient",
  },
  {
    key: "academics",
    title: "Academics Mode AI",
    description:
      "Generate sophisticated academic style content with precise terminology and formal tone. Excellent for research papers, theses, and scholarly articles requiring depth and rigor.",
    route: "/academicsclient",
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05, boxShadow: "0 10px 30px rgba(255,255,255,0.12)" },
};

export default function DashboardPage() {
  const router = useRouter();

  function handleNavigate(route: string) {
    router.push(route);
  }

  return (
    <>
   
      <main className="min-h-screen bg-black text-white p-10">
        <div className="max-w-7xl mx-auto grid gap-12 grid-cols-1 sm:grid-cols-2">
          {dashboardModes.map(({ key, title, description, route }) => (
            <motion.div
              key={key}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => handleNavigate(route)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => e.key === "Enter" && handleNavigate(route)}
              className="cursor-pointer bg-[#111] rounded-3xl p-10 flex flex-col justify-between border border-gray-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-600 hover:shadow-[0_0_30px_rgb(59_130_246/0.8)]"
            >
              <div>
                <h2 className="text-4xl font-extrabold mb-6 text-zinc-300">{title}</h2>
                <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate(route);
                }}
                className="mt-12 py-4 px-8 self-start text-blue-400 border-b-4 border-blue-400 hover:text-blue-300 hover:border-blue-300 rounded-lg font-semibold text-2xl transition"
                aria-label={`Enter ${title}`}
              >
                Open {title.split(" ")[0]}
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
}
