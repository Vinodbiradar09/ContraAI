import React , {useEffect} from "react";
import ModeEditor from "@/components/ModeEditor";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ConcisePage() {
  const router = useRouter();
  const {data : session , status} = useSession();

  useEffect(() => {
    if(status === "loading") return;
    if(!session || !session.user){
      router.replace("/sign-in");
      return;
    }
  }, [session , router , status])
  
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
    <div style={{ padding: "2rem" }}>
      <h1>Concise Mode AI Text</h1>
      <ModeEditor
        mode="concise"
        apiEndpoint="/api/concise"
        inputPlaceholder="Paste content to concise..."
      />
    </div>
  );
}
