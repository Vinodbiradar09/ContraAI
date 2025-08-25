import React from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCopy } from "lucide-react";

interface HistoryCardProps {
  content: string;
  onCopy?: () => void;
  onDelete?: () => void;
  description?: string;
}

const HistoryCard: React.FC<HistoryCardProps> = ({content, onCopy, onDelete, description}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="whitespace-pre-wrap break-words">{content}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <CardAction className="flex gap-2">
          {onCopy && (
            <Button onClick={onCopy} aria-label="Copy content">
              <ClipboardCopy />
            </Button>
          )}
          {onDelete && (
            <Button onClick={onDelete} variant="destructive" aria-label="Delete content">
              Delete
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default HistoryCard;
