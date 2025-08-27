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

  // Lavender theme colors
  const lavender = "#a177b9";

  const inputBg = "#14161b";
  const outputBg = "#0f1116";

  // Fixed height style for consistent editor sizing
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
          color: #e1e2e5;
          font-size: 1.1rem;
          white-space: pre-wrap;
          word-wrap: break-word;
          outline: none;
          box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.4);
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
          color: #d1d2d6;
          font-size: 1.1rem;
          white-space: pre-wrap;
          word-wrap: break-word;
          outline: none;
          box-shadow: inset 0 0 14px rgba(0, 0, 0, 0.5);
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

      const response = await axios.post<ApiRes>(apiEndpoint, { originalContent: text });
      if (!response.data.success) {
        setError(response.data.message || "Failed to transform content.");
      } else {
        setOutputContent(response.data.content || "");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(outputContent);
      toast("Copied!", { description: `${modeLabels[mode]} content copied.` });
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, boxShadow: `0 0 18px ${lavender}` },
    tap: { scale: 0.95, boxShadow: `0 0 10px ${lavender}` },
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-8 rounded-2xl shadow-xl"
      style={{ background: "#0d0f14", border: `1.5px solid ${lavender}` }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Input Editor */}
      <section className="flex flex-col flex-1 rounded-l-2xl shadow-inner overflow-hidden">
        {inputEditor && <EditorContent editor={inputEditor} />}
        <div className="flex justify-between items-center bg-[#191b22] p-4 rounded-bl-2xl text-gray-400 select-none">
          <span>{inputWordCount} words</span>

          <motion.button
            onClick={handleProcess}
            disabled={isLoading}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="rounded-xl px-6 py-2 font-semibold text-black"
            style={{
              background: lavender,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Processing..." : modeLabels[mode]}
          </motion.button>
        </div>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </section>

      {/* Output Editor */}
      <section className="flex flex-col flex-1 rounded-r-2xl shadow-inner overflow-hidden">
        {outputEditor && <EditorContent editor={outputEditor} />}
        <div className="flex justify-between items-center bg-[#15171d] p-4 rounded-br-2xl text-gray-400 select-none">
          <span>{outputWordCount} words</span>
          {outputContent && (
            <motion.button
              onClick={handleCopy}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              aria-label="Copy output"
              className="flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-black"
              style={{
                background: lavender,
                boxShadow: `0 0 12px ${lavender}`,
              }}
            >
              <ClipboardCopy size={18} />
              Copy
            </motion.button>
          )}
        </div>
      </section>
    </motion.div>
  );
}
