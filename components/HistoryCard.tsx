"use client";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, Trash2 } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

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
  const [isHover, setIsHover] = useState(false);

  const handleHoverStart = () => {
    setIsHover(true);
    controls.start({
      scale: 1.02,
      borderColor: "rgba(147, 51, 234, 1)", // Purple border on hover
      boxShadow: "0 0 15px 3px rgba(168, 85, 247, 0.6)",
      transition: { duration: 0.3, ease: "easeInOut" },
    });
  };

  const handleHoverEnd = () => {
    setIsHover(false);
    controls.start({
      scale: 1,
      borderColor: "rgba(147, 51, 234, 0.5)",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      transition: { duration: 0.3, ease: "easeInOut" },
    });
  };

  return (
    <motion.div
      animate={controls}
      initial={{
        scale: 1,
        borderColor: "rgba(147, 51, 234, 0.5)",
        boxShadow: "0 0 0 rgba(0,0,0,0)",
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      style={{ borderWidth: 2, borderStyle: "solid" }}
      className="rounded-xl flex flex-col border bg-neutral-950"
    >
      <Card className="flex flex-col bg-neutral-950 border-0 shadow-none rounded-xl flex-1 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base md:text-lg font-medium leading-relaxed whitespace-pre-wrap break-words max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700">
            {content}
          </CardTitle>
          {description && (
            <CardDescription className="text-gray-400 truncate">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        {/* Footer Section */}
        <CardContent className="pt-2 flex justify-between items-center mt-auto border-t border-gray-800 bg-neutral-900 rounded-b-xl px-4 py-3 select-none">
          {typeof wordCount === "number" && (
            <div className="text-gray-300 text-sm">
              Words: <span className="font-semibold text-white">{wordCount}</span>
            </div>
          )}
          <CardAction className="flex gap-3">
            {onCopy && (
              <Button
                size="sm"
                onClick={onCopy}
                aria-label="Copy content"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-md"
              >
                <ClipboardCopy size={16} />
                Copy
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                onClick={onDelete}
                aria-label="Delete content"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white border-0 shadow-md"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            )}
          </CardAction>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HistoryCard;
