"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";

interface HistoryCardProps {
  content: string;
  onCopy?: () => void;
  onDelete?: () => void;
  description?: string;
  wordCount?: number;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  content,
  onCopy,
  onDelete,
  description,
  wordCount,
}) => {
  return (
    <Card className="group mb-6 relative overflow-hidden w-full max-w-none min-h-[220px] bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl transition-all duration-500 rounded-xl hover:scale-[1.01] hover:-translate-y-1">
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
      
      {/* Content container with glass effect */}
      <div className="relative backdrop-blur-sm">
        <CardHeader className="pb-6 pt-8 px-10">
          <CardTitle className="text-gray-900 dark:text-white leading-relaxed text-xl font-semibold whitespace-pre-wrap break-words min-h-[100px] flex items-start w-full">
            {content}
          </CardTitle>
          {description && (
            <CardDescription className="text-gray-600 dark:text-gray-400 mt-4 text-lg leading-relaxed w-full">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="px-10 pb-8 pt-0 w-full">
          <div className="flex justify-between items-center mt-6 w-full">
            {wordCount !== undefined && (
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-base select-none bg-gray-100 dark:bg-gray-800/50 px-5 py-3 rounded-full backdrop-blur-sm">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="font-semibold text-xl">{wordCount}</span>
                <span className="text-base opacity-75">words</span>
              </div>
            )}
            
            <CardAction className="flex gap-4 ml-auto shrink-0">
              {onCopy && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={onCopy} 
                  aria-label="Copy content" 
                  className="group/btn relative overflow-hidden bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 backdrop-blur-sm px-8 py-4 h-14 min-w-[120px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center gap-3">
                    <ClipboardCopy size={20} className="transition-transform duration-200 group-hover/btn:scale-110" />
                    <span className="font-semibold text-lg">Copy</span>
                  </div>
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={onDelete}
                  aria-label="Delete content"
                  className="group/del relative overflow-hidden bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-600 text-red-700 dark:text-red-400 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md px-8 py-4 h-14 min-w-[120px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover/del:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative font-semibold text-lg">Delete</span>
                </Button>
              )}
            </CardAction>
          </div>
        </CardContent>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </Card>
  );
};

export default HistoryCard;