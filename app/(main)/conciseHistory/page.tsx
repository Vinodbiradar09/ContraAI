"use client"
import { ApiRes } from '@/app/types/ApiResponse';
import HistoryCard from '@/components/HistoryCard';
import axios , {AxiosError} from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import React, { useState , useEffect } from 'react'
import { toast } from 'sonner';

type ConciseItem = {
      _idTransformedConciseContent : string,
      transformedConciseContent : string,
      transformedConciseWordCount : number
}

const ConciseHistory = () => {
  const router = useRouter();
  const {data:session , status} = useSession();
  const [concisedContentHistoryDetails , setConcisedContentHistoryDetails] = useState<ConciseItem[]>([]);
  const [errorHis , setErrorHis] = useState<string>("");
  const [isSubmittingHis , setIsSubmittingHis] = useState<boolean>(false);
  const [errorDel , setErrorDel] = useState<string>("");

  useEffect(() => {
    if(status === "loading") return;
    if(!session || !session.user){
      router.replace("/sign-in");
      return;
    }
  }, [router , session , status])


  useEffect(() => {
    const fetchHistory = async()=>{
      try {
        setIsSubmittingHis(true);
        setErrorHis("");
        const response = await axios.get<ApiRes>("/api/history/concisedHis?mode=concise");
        if(response.data.success && response.data.transformConciseHistory){
          setConcisedContentHistoryDetails(response.data.transformConciseHistory || []);
        } else{
          setErrorHis(response.data.message || "Internal Server Error while accessing the concise history");
        }
      } catch (error) {
        const err = error as AxiosError<ApiRes>;
        setErrorHis(err.response?.data.message || "Internal Server Error Failed To Access The Concise History");
      }finally{
        setIsSubmittingHis(false);
      }
    }

    fetchHistory();
  }, [session?.user])


  const handleCopy = (text : string)=>{
      navigator.clipboard.writeText(text);
  }

  const handleDelete = async(id : string) =>{
    try {
      setErrorDel("");
      if(!id){
        throw new Error("id is required to delete the concise content history");
      }
      const response = await axios.delete<ApiRes>(`/api/delete/concise-del/${id}`)
      if(response.data.success){
        setConcisedContentHistoryDetails((hist)=> hist.filter((item)=> item._idTransformedConciseContent !== id));
        toast("Deleted" , {
          description : response.data.message,
          action : {
            label : "Undo",
            onClick : ()=> console.log("Undo done"),
          }
        })
      } else {
        setErrorDel(response.data.message || "Failed to delete the concise history content")
      }
    } catch (error) {
      const err = error as AxiosError<ApiRes>;
      setErrorDel(err.response?.data.message || "Internal Server Error , failed to delete the concise history");
    }finally {
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
        {!isSubmittingHis && !errorHis && concisedContentHistoryDetails.length === 0 && (
        <p className="text-center text-gray-400">You have zero history.</p>
        )}

        {!isSubmittingHis &&
        concisedContentHistoryDetails.map((item)=> (
            <HistoryCard key={item._idTransformedConciseContent} content={item.transformedConciseContent} onCopy={()=> handleCopy(item.transformedConciseContent)} onDelete={()=> handleDelete(item._idTransformedConciseContent)} wordCount={item.transformedConciseWordCount} />
        ))
        }
    </div>
  )
}

export default ConciseHistory
