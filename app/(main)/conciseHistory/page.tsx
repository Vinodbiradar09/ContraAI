"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import HistoryCard from "@/components/HistoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, cardVariants } from "@/components/Variants";

type ConciseItem = {
  _idTransformedConciseContent: string;
  transformedConciseContent: string;
  transformedConciseWordCount: number;
};

const ConciseHistory = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [concisedContentHistoryDetails, setConcisedContentHistoryDetails] = useState<ConciseItem[]>([]);
  const [errorHis, setErrorHis] = useState("");
  const [isSubmittingHis, setIsSubmittingHis] = useState(false);
  const [errorDel, setErrorDel] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user) {
      router.replace("/sign-in");
      return;
    }
  }, [router, session, status]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsSubmittingHis(true);
        setErrorHis("");
        const response = await axios.get<{
          success: boolean;
          transformConciseHistory?: ConciseItem[];
          message?: string;
        }>("/api/history/concisedHis?mode=concise");
        if (response.data.success && response.data.transformConciseHistory) {
          setConcisedContentHistoryDetails(response.data.transformConciseHistory.reverse() || []);
        } else {
          setErrorHis(response.data.message || "Internal Server Error while accessing the concise history");
        }
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        setErrorHis(err.response?.data.message || "Internal Server Error Failed To Access The Concise History");
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
      const response = await axios.delete<{ success: boolean; message?: string }>(`/api/delete/concise-del/${id}`);
      if (response.data.success) {
        setConcisedContentHistoryDetails((hist) =>
          hist.filter((item) => item._idTransformedConciseContent !== id)
        );
        toast("Deleted", {
          description: response.data.message,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo done"),
          },
        });
      } else {
        setErrorDel(response.data.message || "Failed to delete the concise history content");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorDel(err.response?.data.message || "Internal Server Error, failed to delete the concise history");
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
    <div className="min-h-screen bg-black px-4 py-8">
      <h1 className="text-center text-3xl font-bold text-white mb-8 tracking-wide">
        Concise History
      </h1>

      {isSubmittingHis && <p className="text-center text-gray-400 mb-4">Loading history...</p>}
      {errorHis && <p className="text-center text-red-600 mb-4">{errorHis}</p>}
      {errorDel && <p className="text-center text-red-600 mb-4">{errorDel}</p>}
      {!isSubmittingHis && !errorHis && concisedContentHistoryDetails.length === 0 && (
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
            concisedContentHistoryDetails.map((item) => (
              <motion.div
                key={item._idTransformedConciseContent}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
              >
                <HistoryCard
                  content={item.transformedConciseContent}
                  onCopy={() => handleCopy(item.transformedConciseContent)}
                  onDelete={() => handleDelete(item._idTransformedConciseContent)}
                  wordCount={item.transformedConciseWordCount}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ConciseHistory;
