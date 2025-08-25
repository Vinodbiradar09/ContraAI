"use client"
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { Button } from "./ui/button";
import { ClipboardCopy } from "lucide-react";
import { countWords } from "@/app/helpers/wordsCount";
import { ApiRes } from "@/app/types/ApiResponse";

type ModeType = "humanize" | "refine" | "concise" | "academics";

const modeLabels: Record<ModeType, string> = {
  humanize: "Humanize AI",
  refine: "Refine AI",
  concise: "Concise AI",
  academics: "Academics AI",
};

export default function ModeEditor({
  mode,
  apiEndpoint,
  inputPlaceholder = "",
}: {
  mode: ModeType;
  apiEndpoint: string;
  inputPlaceholder?: string;
}) {
  const [outputContent, setOutputContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputWordCount, setInputWordCount] = useState(0);
  const [outputWordCount, setOutputWordCount] = useState(0);

  // Input editor
  const inputEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setInputWordCount(countWords(editor.getText()));
    },
    editorProps: {
      attributes: {
        spellCheck: "true",
        style: `
          min-height: 250px;
          max-height: 358px;
          padding: 16px;
          padding-bottom: 16px;
          border: 1px solid #ccc;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          overflow-y: auto;
          background: #fff;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 1rem;
        `,
        placeholder: inputPlaceholder,
      },
    },
  });

  // Output editor
  const outputEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setOutputWordCount(countWords(editor.getText()));
    },
    editorProps: {
      attributes: {
        style: `
          min-height: 250px;
          max-height: 358px;
          padding: 16px;
          padding-bottom: 16px;
          border: 1px solid #ddd;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          background: #f9f9f9;
          overflow-y: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 1rem;
        `,
      },
    },
  });

  useEffect(() => {
    if (outputEditor && outputContent !== outputEditor.getHTML()) {
      outputEditor.commands.setContent(outputContent);
      setOutputWordCount(countWords(outputContent));
    }
  }, [outputContent, outputEditor]);

  async function handleProcess() {
    setError("");
    setIsLoading(true);
    setOutputContent("");
    try {
      const originalContent = inputEditor?.getText().trim() || "";

      if (originalContent.length < 50) {
        setError("Please enter at least 50 characters.");
        setIsLoading(false);
        return;
      }
      if (originalContent.length > 3000) {
        setError("Maximum 3000 characters allowed.");
        setIsLoading(false);
        return;
      }
      const response = await axios.post<ApiRes>(apiEndpoint, { originalContent });
      if (response.data.success === false) {
        setError(response.data.message || "Failed to transform content.");
      } else {
        setOutputContent(
          response.data.content || ""
        );
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  const editorBoxStyle: React.CSSProperties = {
    width: "100%",
    marginBottom: "2rem",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  };
  
  const controlBarStyle: React.CSSProperties = {
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    border: "1px solid #ccc",
    borderTop: "none",
    borderRadius: "0 0 8px 8px",
    background: "#fff",
  };
  
  const outputControlBarStyle: React.CSSProperties = {
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    border: "1px solid #ddd",
    borderTop: "none",
    borderRadius: "0 0 8px 8px",
    background: "#f9f9f9",
  };
  
  const leftTextStyle: React.CSSProperties = {
    fontSize: 14,
    color: "#666",
  };

  return (
    <div style={{ display: "flex", gap: 32, width: "100%", marginTop: 24 }}>
     
      <div style={{ ...editorBoxStyle, flex: 1 }}>
        <EditorContent editor={inputEditor} />
        <div style={controlBarStyle}>
          <span style={leftTextStyle}>{inputWordCount} words</span>
          <Button
            onClick={handleProcess}
            disabled={isLoading}
            style={{
              minWidth: 120,
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            {isLoading ? "Processing..." : modeLabels[mode]}
          </Button>
        </div>
        {error && (
          <div style={{ color: "red", marginTop: 8, whiteSpace: "pre-wrap" }}>
            {error}
          </div>
        )}
      </div>

   
      <div style={{ ...editorBoxStyle, flex: 1 }}>
        <EditorContent editor={outputEditor} />
        <div style={outputControlBarStyle}>
          <span style={leftTextStyle}>{outputWordCount} words</span>
          {outputContent && (
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(outputContent)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 500,
                fontSize: 15,
              }}
              aria-label="Copy output content"
            >
              <ClipboardCopy size={18} /> Copy
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}