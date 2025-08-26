"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { ClipboardCopy } from "lucide-react";
import { countWords } from "@/app/helpers/wordsCount";
import { ApiRes } from "@/app/types/ApiResponse";
import { toast } from "sonner";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

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

  // THEME COLOR
  const mainColor = "#9DA2AB";

  // Motion animation with theme integration
  const inputBorder = useMotionValue(mainColor);
  const outputBorder = useMotionValue(mainColor);
  const inputShadow = useTransform(inputBorder, (color) => `0 0 12px ${color}`);
  const outputShadow = useTransform(outputBorder, (color) => `0 0 14px ${color}`);

  React.useEffect(() => {
    animate(inputBorder, [mainColor, "#b4b7c1", mainColor], {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    });
    animate(outputBorder, [mainColor, "#c4c7cf", mainColor], {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
    });
  }, [mainColor, inputBorder, outputBorder]);

  const inputBg = "#14161b"; // stays dark
  const outputBg = "#0f1116"; // darker black/gray for separation

  const inputEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setInputWordCount(countWords(editor.getText())),
    editorProps: {
      attributes: {
        spellCheck: "true",
        style: `
          min-height: 380px;
          max-height: 480px;
          padding: 24px;
          border: 3px solid ${mainColor};
          border-bottom: none;
          border-radius: 18px 18px 0 0;
          overflow-y: auto;
          background: ${inputBg};
          color: #e1e2e5;
          font-size: 1.1rem;
          white-space: pre-wrap;
          word-wrap: break-word;
          outline: none;
          box-shadow: inset 0 0 12px rgba(0,0,0,0.4);
          transition: border-color 0.3s ease;
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
    immediatelyRender: false,
    onUpdate: ({ editor }) => setOutputWordCount(countWords(editor.getText())),
    editorProps: {
      attributes: {
        spellCheck: "false",
        style: `
          min-height: 380px;
          max-height: 480px;
          padding: 24px;
          border: 3px solid ${mainColor};
          border-bottom: none;
          border-radius: 18px 18px 0 0;
          overflow-y: auto;
          background: ${outputBg};
          color: #d1d2d6;
          font-size: 1.1rem;
          white-space: pre-wrap;
          word-wrap: break-word;
          outline: none;
          box-shadow: inset 0 0 14px rgba(0,0,0,0.5);
          transition: border-color 0.3s ease;
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
      const content = inputEditor?.getText().trim() || "";

      if (content.length < 50) {
        setError("Please enter at least 50 characters.");
        setIsLoading(false);
        return;
      }
      if (content.length > 3000) {
        setError("Maximum 3000 characters allowed.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post<ApiRes>(apiEndpoint, { originalContent: content });
      if (response.data.success === false) {
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
      toast("Copied!", {
        description: `${modeLabels[mode]} content has been copied to clipboard`,
        action: { label: "Undo", onClick: () => console.log("Undo clicked") },
      });
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
    hover: { scale: 1.08, boxShadow: `0 0 15px ${mainColor}` },
    tap: { scale: 0.95, boxShadow: `0 0 8px ${mainColor}` },
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-14 p-10 rounded-3xl shadow-xl"
      style={{ background: "#0d0f14", border: `1px solid ${mainColor}` }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Input Editor */}
      <motion.section
        className="flex-1 flex flex-col rounded-3xl overflow-hidden"
        variants={{
          rest: { borderColor: mainColor, boxShadow: `inset 0 0 15px ${mainColor}` },
          hover: { borderColor: "#b4b7c1", boxShadow: `inset 0 0 25px ${mainColor}`, transition: { duration: 0.4 } },
        }}
        initial="rest"
        whileHover="hover"
        style={{ borderWidth: 3, borderStyle: "solid" }}
      >
        <div className="flex-1 p-1">{inputEditor && <EditorContent editor={inputEditor} />}</div>
        <div className="flex justify-between items-center bg-[#191b22] border-t border-[#444853] p-4 rounded-b-3xl">
          <span className="text-gray-400 select-none">{inputWordCount} words</span>
          <motion.button
            onClick={handleProcess}
            disabled={isLoading}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="rounded-xl text-white font-semibold"
            style={{
              padding: "12px 28px",
              background: `linear-gradient(90deg, ${mainColor} 0%, #7f818a 100%)`,
              boxShadow: `0 4px 12px ${mainColor}`,
            }}
          >
            {isLoading ? "Processing..." : modeLabels[mode]}
          </motion.button>
        </div>
        {error && <p className="mt-3 text-red-400 select-none">{error}</p>}
      </motion.section>

      {/* Output Editor */}
      <motion.section
        className="flex-1 flex flex-col rounded-3xl overflow-hidden"
        variants={{
          rest: { borderColor: mainColor, boxShadow: `inset 0 0 18px ${mainColor}` },
          hover: { borderColor: "#c4c7cf", boxShadow: `inset 0 0 28px ${mainColor}`, transition: { duration: 0.4 } },
        }}
        initial="rest"
        whileHover="hover"
        style={{ borderWidth: 3, borderStyle: "solid" }}
      >
        <div className="flex-1 p-1">{outputEditor && <EditorContent editor={outputEditor} />}</div>
        <div className="flex justify-between items-center bg-[#15171d] border-t border-[#444853] p-4 rounded-b-3xl">
          <span className="text-gray-400 select-none">{outputWordCount} words</span>
          {outputContent && (
            <motion.button
              onClick={handleCopy}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              aria-label="Copy output content"
              className="rounded-xl text-white font-semibold border"
              style={{
                borderColor: mainColor,
                padding: "10px 22px",
                color: mainColor,
                boxShadow: `0 0 12px ${mainColor}`,
              }}
            >
              <ClipboardCopy size={18} /> Copy
            </motion.button>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
