"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import HistoryCard from "@/components/HistoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, cardVariants } from "@/components/Variants";

type RefineItem = {
  _idTransformedRefinedContent: string;
  transformedRefinedContent: string;
  transformedRefinedWordCount: number;
};

const RefinedHistory = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [refinedContentHistoryDetails, setRefinedContentHistoryDetails] = useState<RefineItem[]>([]);
  const [isSubmittingHis, setIsSubmittingHis] = useState(false);
  const [errorHis, setErrorHis] = useState("");
  const [errorDel, setErrorDel] = useState("");

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
        const response = await axios.get<{
          success: boolean;
          transformRefineHistory?: RefineItem[];
          message?: string;
        }>("/api/history/refinedHis?mode=refine");

        if (response.data.success && response.data.transformRefineHistory) {
          setRefinedContentHistoryDetails(response.data.transformRefineHistory.reverse() || []);
        } else {
          setErrorHis(response.data.message || "No refined history found");
        }
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        setErrorHis(err.response?.data.message || "Internal server error while accessing the refine history");
      } finally {
        setIsSubmittingHis(false);
      }
    };
    fetchHistory();
  }, [session?.user]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = async (id: string) => {
    try {
      setErrorDel("");
      const response = await axios.delete<{ success: boolean; message?: string }>(
        `/api/delete/refined-del/${id}`
      );
      if (response.data.success) {
        setRefinedContentHistoryDetails((hist) =>
          hist.filter((item) => item._idTransformedRefinedContent !== id)
        );
        toast("Deleted", {
          description: response.data.message,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo done"),
          },
        });
      } else {
        setErrorDel(response.data.message || "Failed to delete refined history");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorDel(err.response?.data.message || "Internal server error while deleting refined history");
    } finally {
      setErrorDel("");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <p className="text-white">Checking Authentication...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
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
          Refined History
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
      {!isSubmittingHis && !errorHis && refinedContentHistoryDetails.length === 0 && (
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
            refinedContentHistoryDetails.map((item) => (
              <motion.div
                key={item._idTransformedRefinedContent}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
              >
                <HistoryCard
                  content={item.transformedRefinedContent}
                  onCopy={() => handleCopy(item.transformedRefinedContent)}
                  onDelete={() => handleDelete(item._idTransformedRefinedContent)}
                  wordCount={item.transformedRefinedWordCount}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RefinedHistory;
