"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ApiRes } from "@/app/types/ApiResponse";
import HistoryCard from "@/components/HistoryCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const HumanizedHistory = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [transformedContent, setTrasformedContent] = useState<string[]>([]);
  const [transformedWordCounts, setTrasformedWordCounts] = useState<number[]>([]);
  const [isSubmittingHis, setIsSubmittingHis] = useState<boolean>(false);
  const [errorHis, setErrorHis] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return; // Wait for session check
    if (!session || !session.user) {
      router.replace("/sign-in");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!session?.user) return;

    const fetchHistory = async () => {
      try {
        setIsSubmittingHis(true);
        setErrorHis("");
        const response = await axios.get<ApiRes>(
          `/api/history/humanizedHis?mode=humanize`
        );
        if (response.data.success && response.data.transformHumanizeHistory) {
          setTrasformedContent(
            response.data.transformHumanizeHistory.map(
              (c: any) => c.transformedHumanizedContent
            ) || []
          );
          setTrasformedWordCounts(
            response.data.transformHumanizeHistory.map(
              (item: any) => item.transformedHumanizedWordCount
            ) || []
          );
        } else {
          setErrorHis(response.data.message || "No history found");
        }
      } catch (error) {
        const err = error as AxiosError<ApiRes>;
        setErrorHis(
          err.response?.data.message ||
            "Internal Server Error while Humanized History fetching"
        );
      } finally {
        setIsSubmittingHis(false);
      }
    };

    fetchHistory();
  }, [session]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Placeholder Delete handler
  const historyDelete = async (id: string) => {
    // Implement your delete logic here
    // e.g. call your API to delete, then remove from state
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
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-400">Please login to access your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {isSubmittingHis && <p className="text-center">Loading history...</p>}
      {errorHis && <p className="text-center text-red-600">{errorHis}</p>}
      {!isSubmittingHis && !errorHis && transformedContent.length === 0 && (
        <p className="text-center text-gray-400">You have zero history.</p>
      )}
      {!isSubmittingHis &&
        transformedContent.map((content, index) => (
          <HistoryCard
            key={index}
            content={content}
            wordCount={transformedWordCounts[index]}
            onCopy={() => handleCopy(content)}
            /* uncomment when delete is implemented
            onDelete={() => historyDelete(transformedContentIds[index])}  
            */
          />
        ))}
    </div>
  );
};

export default HumanizedHistory;
