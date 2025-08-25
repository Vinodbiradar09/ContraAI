import React from "react";
import ModeEditor from "@/components/ModeEditor";

export default function RefinePage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Refine Mode AI Text</h1>
      <ModeEditor
        mode="refine"
        apiEndpoint="/api/refine"
        inputPlaceholder="Paste content to Refine..."
      />
    </div>
  );
}
