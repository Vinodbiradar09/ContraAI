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
  const [copied, setCopied] = useState(false);

  const lavenderGradient =
    "linear-gradient(135deg, #B497BD 0%, #A177B9 50%, #8463AA 100%)";

  // Animate border by cycling box shadow intensity + border color alpha for a glowing lavender effect
  const handleHoverStart = () => {
    controls.start({
      scale: 1.05,
      borderColor: "transparent", // Hide solid border so gradient shines through
      boxShadow: [
        "0 0 6px 2px rgba(180, 135, 190, 0.4)", // start subtle
        "0 0 20px 6px rgba(180, 135, 190, 0.85)", // glow peak
        "0 0 6px 2px rgba(180, 135, 190, 0.4)", // fade back
      ],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      },
      backgroundImage: lavenderGradient,
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box",
      borderWidth: 2,
      borderStyle: "solid",
      borderImageSlice: 1,
      borderImageSource: lavenderGradient,
    });
  };

  const handleHoverEnd = () => {
    controls.start({
      scale: 1,
      borderColor: "rgba(180, 135, 190, 0.5)", // soft lavender solid border
      boxShadow: "0 0 4px 0 rgba(180, 135, 190, 0.25)",
      backgroundImage: "none",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
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
        borderColor: "rgba(180, 135, 190, 0.5)", // static lavender tone border
        boxShadow: "0 0 4px 0 rgba(180, 135, 190, 0.25)", // gentle glow
        backgroundImage: "none",
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
            <CardDescription className="text-gray-400 truncate">{description}</CardDescription>
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
                className="flex items-center gap-2 bg-lavender-600 hover:bg-lavender-700 text-white border-0 shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #B497BD 0%, #A177B9 50%, #8463AA 100%)",
                }}
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
                    className="flex items-center gap-2 bg-[#8D6AA4] hover:bg-[#7A5790] text-white border-0 shadow-md"
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
