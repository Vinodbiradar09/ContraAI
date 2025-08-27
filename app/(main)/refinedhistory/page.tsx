"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import HistoryCard from "@/components/HistoryCard";
import { ClipboardCopy } from "lucide-react";

type RefineItem = {
  _idTransformedRefinedContent: string;
  transformedRefinedContent: string;
  transformedRefinedWordCount: number;
};

const RefinedHistory = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [refinedContentHistoryDetails, setRefinedContentHistoryDetails] = useState<
    RefineItem[]
  >([]);
  const [isSubmittingHis, setIsSubmittingHis] = useState(false);
  const [errorHis, setErrorHis] = useState("");
  const [errorDel, setErrorDel] = useState("");

  // Authentication redirect
  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user) {
      router.replace("/sign-in");
      return;
    }
  }, [session, router, status]);

  // Fetch history data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsSubmittingHis(true);
        setErrorHis("");
        const response = await axios.get<{ success: boolean; transformRefineHistory?: RefineItem[]; message?: string }>(
          "/api/history/refinedHis?mode=refine"
        );
        if (response.data.success && response.data.transformRefineHistory) {
          setRefinedContentHistoryDetails(response.data.transformRefineHistory || []);
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

  // Copy handler
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied history", {
      description: "Your Refined History has been copied",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo done"),
      },
    });
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      setErrorDel("");
      const response = await axios.delete<{ success: boolean; message?: string }>(
        `/api/delete/refined-del/${id}`
      );
      if (response.data.success) {
        setRefinedContentHistoryDetails((hist) => hist.filter((item) => item._idTransformedRefinedContent !== id));
        toast("Deleted", {
          description: response.data.message,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo done"),
          },
        });
      } else {
        setErrorDel(response.data.message || "Internal server error, failed to delete refined history");
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
    <div className="min-h-screen bg-black px-6 py-12 max-w-7xl mx-auto">
      {/* Title */}
      <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-[#d6ccc2] mb-12 select-none">
        Refine History
      </h1>

      {/* Status messages */}
      {isSubmittingHis && <p className="text-center text-[#d6ccc2] mb-4">Loading history...</p>}
      {errorHis && <p className="text-center text-red-600 mb-4">{errorHis}</p>}
      {errorDel && <p className="text-center text-red-600 mb-4">{errorDel}</p>}

      {!isSubmittingHis && !errorHis && refinedContentHistoryDetails.length === 0 && (
        <p className="text-center text-gray-400">You have zero history.</p>
      )}

      {/* Grid container for cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {refinedContentHistoryDetails.map((item) => (
          <div
            key={item._idTransformedRefinedContent}
            className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[350px]"
          >
            <div
              className="p-6 overflow-y-auto flex-1 prose prose-invert text-sm md:text-base whitespace-pre-wrap break-words"
              style={{ scrollbarWidth: "thin" }}
            >
              {item.transformedRefinedContent}
            </div>

            <div className="flex justify-between items-center bg-gray-800 border-t border-gray-700 px-6 py-3 select-none">
              <span className="text-gray-400 text-sm md:text-base">
                Words: <span className="font-semibold">{item.transformedRefinedWordCount}</span>
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCopy(item.transformedRefinedContent)}
                  aria-label="Copy history content"
                  className="flex items-center gap-1 text-gray-300 hover:text-[#9DA2AB] transition-colors"
                >
                  <ClipboardCopy size={18} />
                  <span className="hidden sm:inline">Copy</span>
                </button>
                <button
                  onClick={() => handleDelete(item._idTransformedRefinedContent)}
                  aria-label="Delete history content"
                  className="text-red-600 hover:text-red-500 transition-colors font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefinedHistory;
