import React from "react";
import ModeEditor from "@/components/ModeEditor";

export default function HumanizePage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Humanize Mode AI Text</h1>
      <ModeEditor
        mode="humanize"
        apiEndpoint="/api/humanize"
        inputPlaceholder="Paste content to humanize..."
      />
    </div>
  );
}
