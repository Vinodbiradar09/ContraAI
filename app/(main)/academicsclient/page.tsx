import React from "react";
import ModeEditor from "@/components/ModeEditor";

export default function AcademicsPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Academics Mode AI Text</h1>
      <ModeEditor
        mode="academics"
        apiEndpoint="/api/academics"
        inputPlaceholder="Paste content to academics..."
      />
    </div>
  );
}
