import  { UserInt } from "../model/Users"
import { ContentInt } from "../model/Transformation"


interface TransformHumanizeHistoryItem {
  _idTransformedHumanizedContent: string;
  transformedHumanizedContent: string;
  transformedHumanizedWordCount: number;
}
interface RefineItem {
      _idTransformedRefinedContent : string,
      transformedRefinedContent : string,
      transformedRefinedWordCount : number
}

interface ConciseItem {
      _idTransformedConciseContent : string,
      transformedConciseContent : string,
      transformedConciseWordCount : number
}

export interface ApiRes {
  success: boolean;
  message: string;
  user?: UserInt;
  content?: string;
  wordCount?: number;
  transformHumanizeHistory?: TransformHumanizeHistoryItem[];
  transformRefineHistory? : RefineItem[];
  transformConciseHistory? : ConciseItem[];
}

