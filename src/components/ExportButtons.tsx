"use client";

import { useState } from "react";
import { copyToClipboard, downloadCanvas } from "@/utils/canvasRenderer";

interface ExportButtonsProps {
  canvas: HTMLCanvasElement | null;
  filename: string;
  disabled: boolean;
}

export default function ExportButtons({
  canvas,
  filename,
  disabled,
}: ExportButtonsProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleCopy = async () => {
    if (!canvas) return;
    try {
      await copyToClipboard(canvas);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const handleDownload = async () => {
    if (!canvas) return;
    try {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      await downloadCanvas(canvas, `${filename}-framed-${timestamp}.png`);
      setDownloadStatus("success");
      setTimeout(() => setDownloadStatus("idle"), 2000);
    } catch {
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 2000);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopy}
        disabled={disabled}
        className={`
          flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2
          ${
            disabled
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              : copyStatus === "success"
                ? "bg-green-500 text-white"
                : copyStatus === "error"
                  ? "bg-red-500 text-white"
                  : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          }
        `}
      >
        {copyStatus === "success" ? (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Copied!
          </>
        ) : copyStatus === "error" ? (
          "Copy failed"
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy to clipboard
          </>
        )}
      </button>

      <button
        onClick={handleDownload}
        disabled={disabled}
        className={`
          flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2
          ${
            disabled
              ? "bg-blue-500/30 text-blue-300/50 cursor-not-allowed"
              : downloadStatus === "success"
                ? "bg-green-500 text-white"
                : downloadStatus === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-400"
          }
        `}
      >
        {downloadStatus === "success" ? (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Downloaded!
          </>
        ) : downloadStatus === "error" ? (
          "Download failed"
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PNG
          </>
        )}
      </button>
    </div>
  );
}
