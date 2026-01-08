"use client";

import { DiffToken } from "@/lib/rewrite/types";

interface DiffViewerProps {
  diff: DiffToken[];
}

export function DiffViewer({ diff }: DiffViewerProps) {
  return (
    <div className="h-full overflow-y-auto border border-light-border dark:border-dark-border rounded-input bg-light-surface dark:bg-dark-surface p-6">
      <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {diff.map((token, idx) => {
          if (token.type === "equal") {
            return (
              <span key={idx} className="text-light-text dark:text-dark-text">
                {token.text}
              </span>
            );
          }
          if (token.type === "delete") {
            return (
              <span
                key={idx}
                className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through"
              >
                {token.text}
              </span>
            );
          }
          if (token.type === "insert") {
            return (
              <span
                key={idx}
                className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              >
                {token.text}
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
