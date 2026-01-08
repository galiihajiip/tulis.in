"use client";

import { SimilarityMetrics } from "@/lib/rewrite/types";
import { Info } from "lucide-react";

interface SimilarityPanelProps {
  metrics?: SimilarityMetrics;
}

export function SimilarityPanel({ metrics }: SimilarityPanelProps) {
  if (!metrics) {
    return (
      <div className="p-6 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-card">
        <p className="text-sm text-slate-500">
          Belum ada data similarity. Lakukan rewrite terlebih dahulu.
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score > 0.8) return "text-red-600 dark:text-red-400";
    if (score > 0.5) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  return (
    <div className="p-6 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-card space-y-4">
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Skor similarity ini hanya untuk awareness, bukan untuk bypass detector.
          Fokus pada clarity dan meaning preservation.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-light-text dark:text-dark-text">
              Trigram Jaccard
            </span>
            <span className={`text-sm font-bold ${getScoreColor(metrics.trigramJaccard)}`}>
              {(metrics.trigramJaccard * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-brand-primary h-2 rounded-full transition-all"
              style={{ width: `${metrics.trigramJaccard * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-light-text dark:text-dark-text">
              TF-IDF Cosine
            </span>
            <span className={`text-sm font-bold ${getScoreColor(metrics.tfidfCosine)}`}>
              {(metrics.tfidfCosine * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-brand-primary h-2 rounded-full transition-all"
              style={{ width: `${metrics.tfidfCosine * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
