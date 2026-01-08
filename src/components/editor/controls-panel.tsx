"use client";

import { RewriteParams, RewriteMode } from "@/lib/rewrite/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ControlsPanelProps {
  params: RewriteParams;
  onChange: (params: RewriteParams) => void;
  onRewrite: () => void;
  loading?: boolean;
}

export function ControlsPanel({
  params,
  onChange,
  onRewrite,
  loading = false,
}: ControlsPanelProps) {
  const modes: { value: RewriteMode; label: string }[] = [
    { value: "ringkas", label: "Lebih Ringkas" },
    { value: "formal", label: "Lebih Formal" },
    { value: "santai", label: "Lebih Santai" },
    { value: "akademik", label: "Akademik" },
    { value: "baku", label: "Bahasa Indonesia Baku" },
  ];

  return (
    <div className="space-y-6 p-6 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-card">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-light-text dark:text-dark-text">
          Mode Rewrite
        </h3>
        <Select
          value={params.mode}
          onValueChange={(value) =>
            onChange({ ...params, mode: value as RewriteMode })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih mode" />
          </SelectTrigger>
          <SelectContent>
            {modes.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                {mode.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-semibold mb-3 block text-light-text dark:text-dark-text">
          Tone: {params.tone === 1 ? "Santai" : params.tone === 5 ? "Formal" : "Netral"}
        </label>
        <Slider
          value={[params.tone]}
          onValueChange={([value]) =>
            onChange({ ...params, tone: value as any })
          }
          min={1}
          max={5}
          step={1}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Santai</span>
          <span>Formal</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-3 block text-light-text dark:text-dark-text">
          Readability: {params.readability === 1 ? "SMA" : params.readability === 5 ? "Akademik" : "Sedang"}
        </label>
        <Slider
          value={[params.readability]}
          onValueChange={([value]) =>
            onChange({ ...params, readability: value as any })
          }
          min={1}
          max={5}
          step={1}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>SMA</span>
          <span>Akademik</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-3 block text-light-text dark:text-dark-text">
          Meaning Preservation
        </label>
        <Select
          value={params.strictness}
          onValueChange={(value) =>
            onChange({ ...params, strictness: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High (Recommended)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={onRewrite}
        disabled={loading}
        className="w-full bg-brand-primary hover:bg-brand-primary-hover"
      >
        {loading ? "Memproses..." : "Rewrite (Ctrl+Enter)"}
      </Button>
    </div>
  );
}
