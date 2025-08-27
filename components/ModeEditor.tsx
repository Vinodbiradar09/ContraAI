"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { ClipboardCopy } from "lucide-react";
import { countWords } from "@/app/helpers/wordsCount";
import { ApiRes } from "@/app/types/ApiResponse";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  const [outputContent, setOutputContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [inputWordCount, setInputWordCount] = React.useState(0);
  const [outputWordCount, setOutputWordCount] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const silver = "#d1d5db"; // tailwind neutral-300 for metallic silver
  const inputBg = "#14161b";
  const outputBg = "#0f1116";
  const editorFixedHeightStyle = `
    min-height: 480px;
    max-height: 480px;
    overflow-y: auto;
  `;

  const inputEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: true,
    immediatelyRender : false,
    onUpdate: ({ editor }) => setInputWordCount(countWords(editor.getText())),
    editorProps: {
      attributes: {
        spellCheck: "true",
        style: `
          padding: 24px;
          background: ${inputBg};
          color: #e5e7eb;
          font-size: 1.1rem;
          border-radius: 18px 0 0 18px;
          ${editorFixedHeightStyle}
        `,
        className: "prose prose-invert max-w-full",
        placeholder: inputPlaceholder,
      },
    },
  });

  const outputEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: true,
    immediatelyRender : false,
    onUpdate: ({ editor }) => setOutputWordCount(countWords(editor.getText())),
    editorProps: {
      attributes: {
        spellCheck: "false",
        style: `
          padding: 24px;
          background: ${outputBg};
          color: #e5e7eb;
          font-size: 1.1rem;
          border-radius: 0 18px 18px 0;
          ${editorFixedHeightStyle}
        `,
        className: "prose prose-invert max-w-full",
      },
    },
  });

  React.useEffect(() => {
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
      const text = inputEditor?.getText().trim() ?? "";
      if (text.length < 50) {
        setError("Please enter at least 50 characters.");
        setIsLoading(false);
        return;
      }
      if (text.length > 3000) {
        setError("Maximum 3000 characters allowed.");
        setIsLoading(false);
        return;
      }
      const response = await axios.post<ApiRes>(apiEndpoint, {
        originalContent: text,
      });
      if (!response.data.success) setError(response.data.message || "Failed to transform content.");
      else setOutputContent(response.data.content || "");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(outputContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.07, boxShadow: `0 0 20px ${silver}` },
    tap: { scale: 0.95, boxShadow: `0 0 12px ${silver}` },
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-6 rounded-2xl"
      style={{
        background: "#0d0f14",
        border: `1.5px solid ${silver}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Input */}
      <section className="flex flex-col flex-1 overflow-hidden">
        {inputEditor && <EditorContent editor={inputEditor} />}
        <div className="flex justify-between items-center bg-[#1b1b1b] p-4 text-gray-400">
          <span>{inputWordCount} words</span>
          <motion.button
            onClick={handleProcess}
            disabled={isLoading}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="rounded-xl px-6 py-2 font-semibold text-black"
            style={{ background: silver, opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? "Processing..." : modeLabels[mode]}
          </motion.button>
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </section>

      {/* Output */}
      <section className="flex flex-col flex-1 overflow-hidden">
        {outputEditor && <EditorContent editor={outputEditor} />}
        <div className="flex justify-between items-center bg-[#1b1b1b] p-4 text-gray-400">
          <span>{outputWordCount} words</span>
          {outputContent && (
            <motion.button
              onClick={handleCopy}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-black"
              style={{ background: silver, boxShadow: `0 0 14px ${silver}` }}
            >
              <ClipboardCopy size={18} />
              {copied ? "Copied" : "Copy"}
            </motion.button>
          )}
        </div>
      </section>
    </motion.div>
  );
}
