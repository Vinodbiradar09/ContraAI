"use client";
import { ApiRes } from '@/app/types/ApiResponse'
import HistoryCard from '@/components/HistoryCard'
import axios , {AxiosError}from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState , useEffect } from 'react'
import { toast } from 'sonner'


type RefineItem = {
      _idTransformedRefinedContent : string,
      transformedRefinedContent : string,
      transformedRefinedWordCount : number
}

const RefinedHistory = () => {
  const router = useRouter();
  const {data:session , status} = useSession();
  const [refinedContentHistoryDetails ,  setRefinedContentHistoryDetails] = useState<RefineItem[]>([]);
  const [isSubmittingHis , setIsSubmittingHis] = useState<boolean>(false);
  const [errorHis , setErrorHis] = useState<string>("");
  const [errorDel , setErrorDel] = useState<string>("");

  useEffect(() => {
    if(status === "loading") return;
    if(!session || !session.user){
      router.replace("/sign-in");
      return;
    }
  }, [session , router , status])

  useEffect(() => {
    const fetchHistory = async()=>{
      try {
        setIsSubmittingHis(true);
        setErrorHis("");
        const response = await axios.get<ApiRes>("/api/history/refinedHis?mode=refine");
        if(response.data.success && response.data.transformRefineHistory){
            setRefinedContentHistoryDetails(response.data.transformRefineHistory || []);
        } else {
          setErrorHis(response.data.message || "No refined history found");
        }
      } catch (error) {
          const err = error as AxiosError<ApiRes>
          setErrorHis(err.response?.data.message || "Internal server Error while accessing the refine history");
      } finally{
        setIsSubmittingHis(false);
      }
    }

    fetchHistory();
  }, [session?.user])

  const handleCopy = (text : string)=>{
      navigator.clipboard.writeText(text);
      toast("copied history" , {
        description : "Your Refined History Has been copied",
        action : {
          label : "Undo",
          onClick : ()=> console.log("Undo done"),
        }
      })
  }
  
  const handleDelete = async(id : string)=>{
    try {
      setErrorDel("");
      const response = await axios.delete<ApiRes>(`/api/delete/refined-del/${id}`)
      if(response.data.success){
        setRefinedContentHistoryDetails((hist)=> hist.filter((item)=> item._idTransformedRefinedContent !== id));
        toast("Deleted" , {
          description : response.data.message,
          action : {
            label : "Undo",
            onClick : ()=> console.log("Undo done"),
          }
        })
      } else {
        setErrorDel(response.data.message || "Internal server Error , Failed to delete the refined history")
      }
    } catch (error) {
      const err = error as AxiosError<ApiRes>
      setErrorDel(err.response?.data.message || "Internal server error while deleting the refined history")
    } finally {
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
        {!isSubmittingHis && !errorHis && refinedContentHistoryDetails.length === 0 && (
        <p className="text-center text-gray-400">You have zero history.</p>
        )}

        {!isSubmittingHis && 
        
        refinedContentHistoryDetails.map((item)=>(
          <HistoryCard key={item._idTransformedRefinedContent} content={item.transformedRefinedContent} onCopy={()=> handleCopy(item.transformedRefinedContent)} onDelete={()=> handleDelete(item._idTransformedRefinedContent)} wordCount={item.transformedRefinedWordCount} />
        ))
        
        }
    </div>
  )
}

export default RefinedHistory
