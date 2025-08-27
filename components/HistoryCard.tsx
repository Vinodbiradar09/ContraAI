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
      scale: 1.04,
      boxShadow: "0 0 20px 6px rgba(204, 21, 202, 0.8)",
      borderColor: "rgba(204, 21, 202, 1)",
      transition: { duration: 0.3, ease: "easeInOut" },
    });
  };

  const handleHoverEnd = () => {
    setIsHover(false);
    controls.start({
      scale: 1,
      boxShadow: "0 0 0 rgba(204, 21, 202, 0)",
      borderColor: "rgba(204, 21, 202, 0.5)",
      transition: { duration: 0.3, ease: "easeInOut" },
    });
  };

  return (
    <motion.div
      animate={controls}
      initial={{
        scale: 1,
        boxShadow: "0 0 0 rgba(204, 21, 202, 0)",
        borderColor: "rgba(204, 21, 202, 0.5)",
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      style={{ borderWidth: 2, borderStyle: "solid" }}
      className="mb-6 rounded-2xl max-h-[350px] flex flex-col border bg-black"
    >
      <Card className="flex flex-col bg-black shadow-none rounded-none border-none p-0 flex-1 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle
            className="text-white text-base md:text-lg font-medium leading-relaxed whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            {content}
          </CardTitle>
          {description && (
            <CardDescription className="text-gray-400 truncate">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-2 flex justify-between items-center mt-auto border-t border-gray-700 bg-black rounded-b-2xl px-4 py-3 select-none">
          {typeof wordCount === "number" && (
            <div className="text-white text-sm">
              Words: <span className="font-semibold">{wordCount}</span>
            </div>
          )}
          <CardAction className="flex gap-3">
            {onCopy && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCopy}
                aria-label="Copy content"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-lg hover:shadow-pink-700 border-transparent"
              >
                <ClipboardCopy size={16} />
                Copy
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                aria-label="Delete content"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white shadow-lg hover:shadow-pink-700 border-transparent"
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
