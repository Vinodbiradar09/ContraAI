import  { UserInt } from "../model/Users"
import { ContentInt } from "../model/Transformation"


interface TransformHumanizeHistoryItem {
  _idTransformedHumanizedContent: string;
  transformedHumanizedContent: string;
  transformedHumanizedWordCount: number;
}

export interface ApiRes {
  success: boolean;
  message: string;
  user?: UserInt;
  content?: string;
  wordCount?: number;
  transformHumanizeHistory?: TransformHumanizeHistoryItem[];
}

