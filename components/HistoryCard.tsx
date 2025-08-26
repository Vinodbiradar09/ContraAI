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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

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
}) => (
  <Card className="mb-6 bg-gray-900 border border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
    <CardHeader className="pb-0">
      <CardTitle className="text-white whitespace-pre-wrap break-words text-base md:text-lg font-medium leading-relaxed">
        {content}
      </CardTitle>
      {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="pt-2 flex justify-between items-center">
      {typeof wordCount === "number" && (
        <div className="text-gray-400 text-sm select-none">
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
            className="flex items-center gap-2"
          >
            <ClipboardCopy size={16} />
            Copy
          </Button>
        )}
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                aria-label="Delete content"
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your History Content and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep History</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardAction>
    </CardContent>
  </Card>
);

export default HistoryCard;
