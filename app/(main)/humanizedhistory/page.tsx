"use client"
import React, { useState , useEffect } from 'react'
import {ClipboardCopy} from "lucide-react";
import { Button } from '@/components/ui/button';
import axios , {AxiosError} from 'axios';
import { ApiRes } from '@/app/types/ApiResponse';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HistoryCard from '@/components/HistoryCard';
const HumanizedHistory = () => {
    const router = useRouter();
    const [idTransformedContent , setIdTransformedContent] = useState(null);
    const [transformedContent , setTrasformedContent] = useState<string[]>([]);
    const [transformedWordCounts , setTrasformedWordCounts] = useState<number>(0);
    const [isSubmittingHis , setIsSubmittingHis] = useState<boolean>(false);
    const [errorHis , setErrorHis] = useState<string>("");
    const humanize = "humanize";

    const {data : session} = useSession();

    useEffect(() => {
        if(!session || !session.user){
            router.replace("/sign-in")
            return
        }
    }, [])
    

   useEffect(() => {

     const fetchHistory = async ()=>{
        try {
            setIsSubmittingHis(true);
            setErrorHis("");
            const response = await axios.get<ApiRes>(`/api/history/humanizedHis?mode=${humanize}`);
            if(response.data.success && response.data.transformHumanizeHistory){
                setTrasformedContent(response.data?.transformHumanizeHistory.map((c : any)=> c.transformedHumanizedContent) || []);
            } else{
                setErrorHis(response.data.message || "No history found");
            }
        } catch (error) {
            const err = error as AxiosError<ApiRes>;
            setErrorHis(err.response?.data.message || "Internal Server Error while Humanized History fetching");
        } finally{
            setIsSubmittingHis(false);
        }
    }

    fetchHistory();
   }, [])

   const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };


   if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-400">Please login to access your dashboard</p>
        </div>
      </div>
    );
  }
   
  return (
    <div  className="px-6 py-8 max-w-4xl mx-auto">
        {isSubmittingHis && <p className="text-center">Loading history...</p>}
      {errorHis && <p className="text-center text-red-600">{errorHis}</p>}
      {!isSubmittingHis && !errorHis && transformedContent.length === 0 && (
        <p className="text-center text-gray-400">You have zero history.</p>
      )}
      {
        !isSubmittingHis && transformedContent.map((content , index)=>(
            <HistoryCard  key={index} onCopy={()=> handleCopy(content)}  content={content}/>
        ))
      }
    </div>
  )
}

export default HumanizedHistory
