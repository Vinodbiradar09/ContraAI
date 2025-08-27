"use client";
import React, { useState } from "react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, Trash2 } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface HistoryCardProps {
  id?: string;
  content: string;
  wordCount?: number;
  description?: string;
  onCopy?: () => void;
  onDelete?: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  content,
  wordCount,
  description,
  onCopy,
  onDelete,
}) => {
  const controls = useAnimation();
  const [copied, setCopied] = useState(false);

  // Hover animations with silver glow
  const handleHoverStart = () => {
    controls.start({
      scale: 1.03,
      boxShadow: [
        "0 0 6px rgba(209,213,219,0.3)",
        "0 0 16px rgba(255,255,255,0.6)",
        "0 0 6px rgba(209,213,219,0.3)",
      ],
      transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
      borderColor: "#d1d5db",
    });
  };

  const handleHoverEnd = () => {
    controls.start({
      scale: 1,
      borderColor: "rgba(209,213,219,0.4)",
      boxShadow: "0 0 4px rgba(255,255,255,0.2)",
      transition: { duration: 0.6, ease: "easeOut" },
    });
  };

  const handleCopyClick = () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      animate={controls}
      initial={{
        scale: 1,
        borderColor: "rgba(209,213,219,0.4)",
        boxShadow: "0 0 4px rgba(255,255,255,0.15)",
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      style={{ borderWidth: 1.5, borderStyle: "solid" }}
      className="rounded-xl flex flex-col bg-neutral-950"
    >
      <Card className="flex flex-col bg-neutral-950 border-0 shadow-none rounded-xl flex-1 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap break-words max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
            {content}
          </CardTitle>
          {description && <p className="text-gray-400 truncate">{description}</p>}
        </CardHeader>

        {/* Footer */}
        <CardContent className="pt-2 flex justify-between items-center mt-auto border-t border-gray-800 bg-neutral-900 rounded-b-xl px-4 py-3 select-none">
          {typeof wordCount === "number" && (
            <div className="text-gray-300 text-sm">
              Words: <span className="font-semibold text-white">{wordCount}</span>
            </div>
          )}
          <CardAction className="flex gap-3 items-center">
            {onCopy && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={handleCopyClick}
                  className="flex items-center gap-2 bg-[#111] text-white border border-gray-600 hover:shadow-[0_0_10px_rgba(255,255,255,0.4)] transition"
                >
                  <ClipboardCopy size={16} />
                  {copied ? "Copied" : "Copy"}
                </Button>
              </motion.div>
            )}

            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      className="flex items-center gap-2 bg-[#111] text-red-400 border border-red-700 hover:bg-red-700 hover:text-white transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </motion.div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this history? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardAction>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HistoryCard;
