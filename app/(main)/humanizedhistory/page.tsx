"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ApiRes } from "@/app/types/ApiResponse";
import HistoryCard from "@/components/HistoryCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence} from "framer-motion";
import { easeIn, easeOut } from "framer-motion";

type HistoryItem = {
  _idTransformedHumanizedContent: string;
  transformedHumanizedContent: string;
  transformedHumanizedWordCount: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: easeIn },
  },
};

const HumanizedHistory = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [transformedHistory, setTransformedHistory] = useState<HistoryItem[]>([]);
  const [isSubmittingHis, setIsSubmittingHis] = useState<boolean>(false);
  const [errorHis, setErrorHis] = useState<string>("");
  const [errorDel, setErrorDel] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user) {
      router.replace("/sign-in");
      return;
    }
  }, [session, router, status]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsSubmittingHis(true);
        setErrorHis("");
        const response = await axios.get<ApiRes>("/api/history/humanizedHis?mode=humanize");
        if (response.data.success && response.data.transformHumanizeHistory) {
          setTransformedHistory(response.data.transformHumanizeHistory.reverse() || []);
        } else {
          setErrorHis(response.data.message || "No Humanized History found");
        }
      } catch (error) {
        const err = error as AxiosError<ApiRes>;
        setErrorHis(err.response?.data.message || "Internal server Error can't access history");
      } finally {
        setIsSubmittingHis(false);
      }
    };
    fetchHistory();
  }, [session?.user]);

  const handleCopy = (text: string) => navigator.clipboard.writeText(text);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete<ApiRes>(`/api/delete/humanized-del/${id}`);
      if (response.data.success) {
        setTransformedHistory((hist) =>
          hist.filter((item) => item._idTransformedHumanizedContent !== id)
        );
      } else {
        setErrorDel(response.data.message || "Failed to delete history");
      }
    } catch (error) {
      const err = error as AxiosError<ApiRes>;
      setErrorDel(err.response?.data.message || "Internal Server Error while deleting history");
    } finally {
      setErrorDel("");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Checking Authentication...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400">Please login to access your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-12">
    
      <div className="text-center mb-12">
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent 
                     bg-gradient-to-r from-gray-200 via-white to-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: -10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Humanized History
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 1.05, 1] }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="h-[2px] mt-3 rounded-full bg-gradient-to-r 
                     from-gray-200 via-white to-gray-400 mx-auto w-1/3 origin-left"
        />
      </div>

     
      {isSubmittingHis && <p className="text-center text-gray-400 mb-4">Loading history...</p>}
      {errorHis && <p className="text-center text-red-600 mb-4">{errorHis}</p>}
      {errorDel && <p className="text-center text-red-600 mb-4">{errorDel}</p>}
      {!isSubmittingHis && !errorHis && transformedHistory.length === 0 && (
        <p className="text-center text-gray-400">You have zero history.</p>
      )}

   
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto"
      >
        <AnimatePresence>
          {!isSubmittingHis &&
            transformedHistory.map((item) => (
              <motion.div
                key={item._idTransformedHumanizedContent}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
              >
                <HistoryCard
                  content={item.transformedHumanizedContent}
                  onCopy={() => handleCopy(item.transformedHumanizedContent)}
                  onDelete={() => handleDelete(item._idTransformedHumanizedContent)}
                  wordCount={item.transformedHumanizedWordCount}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HumanizedHistory;
