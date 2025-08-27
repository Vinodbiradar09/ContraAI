"use client"
import React , {useEffect} from "react";
import ModeEditor from "@/components/ModeEditor";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function HumanizePage() {

  const router = useRouter();
  const {data : session , status} = useSession();

  useEffect(() => {
   if(status === "loading") return;
   if(!session || !session.user){
    router.replace("/sign-in");
    return;
   }
  }, [session , router , status])

  
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <p className="text-[#d6ccc2] text-lg font-semibold animate-pulse">Checking Authentication...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-[#d6ccc2] mb-3">Authentication Required</h2>
          <p className="text-[#b7afa6] text-base">Please login to access your dashboard</p>
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
         <motion.h1
           className="text-xl sm:text-2xl font-extrabold text-[#393E46] max-w-4xl text-center mb-1 select-none"
           initial={{ opacity: 0, y: -0 }}
           animate={{ opacity: 1, y:  -12 }}
           transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
         >
           Humanize Mode AI Text
         </motion.h1>
   
         <div className="w-full max-w-7xl">
            <ModeEditor
            mode="humanize"
            apiEndpoint="/api/humanize"
            inputPlaceholder="Paste content to humanize..."
          />
         </div>
       </motion.div>
  );
}
