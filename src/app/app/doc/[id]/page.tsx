"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { EditorPanel } from "@/components/editor/editor-panel";
import { ControlsPanel } from "@/components/editor/controls-panel";
import { DiffViewer } from "@/components/editor/diff-viewer";
import { SimilarityPanel } from "@/components/editor/similarity-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RewriteParams, RewriteResult } from "@/lib/rewrite/types";
import { debounce } from "@/lib/utils";
import { Copy, Download, FileText } from "lucide-react";

export default function DocumentPage() {
  const params = useParams();
  const documentId = params.id as string;

  const [originalContent, setOriginalContent] = useState("");
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"editor" | "diff">("editor");
  const [rewriteParams, setRewriteParams] = useState<RewriteParams>({
    tone: 3,
    readability: 3,
    strictness: "high",
    mode: "formal",
  });

  // Auto-save
  const saveDocument = useCallback(
    debounce(async (content: string) => {
      await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "demo-user", // Replace with actual auth
        },
        body: JSON.stringify({ contentOriginal: content }),
      });
    }, 2000),
    [documentId]
  );

  const handleRewrite = async () => {
    if (!originalContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: originalContent,
          params: rewriteParams,
          documentId,
          userId: "demo-user", // Replace with actual auth
        }),
      });

      if (!response.ok) throw new Error("Rewrite failed");

      const result: RewriteResult = await response.json();
      setRewriteResult(result);
      setViewMode("diff");
    } catch (error) {
      console.error("Rewrite error:", error);
      alert("Terjadi kesalahan saat rewrite. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (rewriteResult) {
      navigator.clipboard.writeText(rewriteResult.rewritten);
      alert("Teks berhasil disalin!");
    }
  };

  const handleAddDisclosure = () => {
    if (rewriteResult) {
      const disclosure =
        "\n\n---\n*Catatan: Bagian ini disunting dengan bantuan alat parafrase untuk meningkatkan kejelasan.*";
      navigator.clipboard.writeText(rewriteResult.rewritten + disclosure);
      alert("Teks dengan disclosure berhasil disalin!");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRewrite();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setViewMode((prev) => (prev === "editor" ? "diff" : "editor"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [originalContent, rewriteParams]);

  return (
    <div className="h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
      {/* Top Bar */}
      <div className="h-16 border-b border-light-border dark:border-dark-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-brand-primary">Tulis.in</h1>
          <span className="text-sm text-slate-500">Document Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!rewriteResult}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={handleAddDisclosure} disabled={!rewriteResult}>
            <FileText className="w-4 h-4 mr-2" />
            + Disclosure
          </Button>
          <Button variant="secondary" size="sm" disabled>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="flex-1 p-6 overflow-hidden">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="diff">Diff View</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="h-[calc(100vh-180px)]">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-light-text dark:text-dark-text">
                    Original
                  </h3>
                  <EditorPanel
                    content={originalContent}
                    onChange={(content) => {
                      setOriginalContent(content);
                      saveDocument(content);
                    }}
                    placeholder="Mulai menulis atau paste teks di sini..."
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-light-text dark:text-dark-text">
                    Rewritten
                  </h3>
                  <EditorPanel
                    content={rewriteResult?.rewritten || ""}
                    editable={false}
                    placeholder="Hasil rewrite akan muncul di sini..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="diff" className="h-[calc(100vh-180px)]">
              {rewriteResult ? (
                <DiffViewer diff={rewriteResult.diff} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Belum ada diff. Lakukan rewrite terlebih dahulu.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Controls */}
        <div className="w-80 border-l border-light-border dark:border-dark-border p-6 overflow-y-auto space-y-6">
          <ControlsPanel
            params={rewriteParams}
            onChange={setRewriteParams}
            onRewrite={handleRewrite}
            loading={loading}
          />
          <SimilarityPanel metrics={rewriteResult?.similarity} />
        </div>
      </div>
    </div>
  );
}
