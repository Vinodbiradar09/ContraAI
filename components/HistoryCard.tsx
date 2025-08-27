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
  const [isHover, setIsHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleHoverStart = () => {
    setIsHover(true);
    controls.start({
      scale: 1.02,
      borderColor: "rgba(94, 129, 172, 1)", // Calm blue border on hover
      boxShadow: "0 0 12px 3px rgba(94, 129, 172, 0.5)",
      transition: { duration: 0.3, ease: "easeInOut" },
    });
  };

  const handleHoverEnd = () => {
    setIsHover(false);
    controls.start({
      scale: 1,
      borderColor: "rgba(94, 129, 172, 0.35)", // Softer blue border default
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      transition: { duration: 0.3, ease: "easeInOut" },
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
        borderColor: "rgba(94, 129, 172, 0.35)", // Border default color
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

        <CardContent className="pt-2 flex justify-between items-center mt-auto border-t border-gray-800 bg-neutral-900 rounded-b-xl px-4 py-3 select-none">
          {typeof wordCount === "number" && (
            <div className="text-gray-300 text-sm">
              Words: <span className="font-semibold text-white">{wordCount}</span>
            </div>
          )}
          <CardAction className="flex gap-3 items-center">
            {onCopy && (
              <Button
                size="sm"
                onClick={handleCopyClick}
                aria-label="Copy content"
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white border-0 shadow-md"
              >
                <ClipboardCopy size={16} />
                {copied ? "Copied" : "Copy"}
              </Button>
            )}

            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    aria-label="Delete content"
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white border-0 shadow-md"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
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
