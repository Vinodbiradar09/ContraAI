import React from "react";
import ModeEditor from "@/components/ModeEditor";

export default function ConcisePage() {
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
