"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ApiRes } from "@/app/types/ApiResponse";
import HistoryCard from "@/components/HistoryCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type HistoryItem = {
    _idTransformedHumanizedContent : string,
    transformedHumanizedContent : string,
    transformedHumanizedWordCount : number
}

const HumanizedHistory = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [transformedHistory , setTransformedHistory] = useState<HistoryItem[]>([]);
    const [isSubmittingHis, setIsSubmittingHis] = useState<boolean>(false);
    const [errorHis, setErrorHis] = useState<string>("");
    const [errorDel , setErrorDel] = useState<string>("");

    useEffect(() => {
        if(status === "loading") return;
        if(!session || !session.user){
            router.replace("/sign-in");
            return;
        }
    }, [session , router , status]) 

    useEffect(() => {
        const fetchHistory = async ()=>{
            try {
            setIsSubmittingHis(true);
            setErrorHis("");
            const response = await axios.get<ApiRes>("/api/history/humanizedHis?mode=humanize");
            if(response.data.success && response.data.transformHumanizeHistory){
                setTransformedHistory(response.data?.transformHumanizeHistory);
            }else {
                setErrorHis(response.data.message || "No Humanized History found");
            }
        } catch (error) {
            const err = error as AxiosError<ApiRes>;
            setErrorHis(err.response?.data.message || "Internal server Error can't access the Humanized history");
        }finally{
            setIsSubmittingHis(false);
        }
        }

        fetchHistory();
    }, [session?.user])

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleDelete = async (id : string)=>{
        try {
            const response = await axios.delete<ApiRes>(`/api/delete/humanized-del/${id}`);
            console.log("rrr" , response.data.message);
            if(response.data.success){
                setTransformedHistory((hist)=> hist.filter((item)=> item._idTransformedHumanizedContent !== id));
                toast(response.data.message , {
                    description : "The Humanized History Has been deleted",
                    action : {
                        label : "Undo",
                        onClick : ()=> console.log("Undo done")
                    }
                })
            } else {
                setErrorDel(response.data.message || "Failed to delete the Humanized History");
            }
        } catch (error) {
            console.log("iddd" , id);
            console.log("reee" , error);
            const err = error as AxiosError<ApiRes>;
            setErrorDel(err.response?.data.message || "Internal Server Error While Deleting the Humanized History")
        } finally{
            setErrorDel("");
        }
    }

if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Checking Authentication...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-400">Please login to access your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div>
        {isSubmittingHis && <p className="text-center">Loading history...</p>}
        {errorHis && <p className="text-center text-red-600">{errorHis}</p>}
        {errorDel && <p className="text-center text-red-600">{errorDel}</p>}
        {!isSubmittingHis && !errorHis && transformedHistory.length === 0 && (
        <p className="text-center text-gray-400">You have zero history.</p>
        )}
        {
            !isSubmittingHis && 
            transformedHistory.map((item)=>(
                <HistoryCard key={item._idTransformedHumanizedContent} content={item.transformedHumanizedContent} onCopy={()=> handleCopy(item.transformedHumanizedContent)} onDelete={()=> handleDelete(item._idTransformedHumanizedContent)} wordCount={item.transformedHumanizedWordCount}  />
            ))
        }
    </div>
  );
};

export default HumanizedHistory;
