import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Shield, BookOpen, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Tulis.in — Parafrase etis untuk tulisan yang lebih jelas
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Bukan untuk mengakali detector. Untuk bantu kamu menulis lebih rapi,
            konsisten, dan punya sitasi yang benar.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/app/doc/demo">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-primary-hover">
                Coba Gratis
              </Button>
            </Link>
            <Button size="lg" variant="secondary">
              Lihat Demo
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-brand-primary" />}
            title="Diff View"
            description="Lihat perubahan dengan jelas. Highlight insertions dan deletions untuk transparansi penuh."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-brand-primary" />}
            title="Similarity Awareness"
            description="Cek tingkat kemiripan dengan trigram Jaccard dan TF-IDF cosine untuk awareness, bukan bypass."
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-brand-primary" />}
            title="Citations Helper"
            description="Paste sumber/URL dan dapatkan suggested citations dalam format APA atau IEEE."
          />
          <FeatureCard
            icon={<CheckCircle className="w-8 h-8 text-brand-primary" />}
            title="Fact Guard"
            description="Angka, nama, kutipan, dan istilah teknis dijaga agar tidak berubah."
          />
        </div>

        {/* Principles */}
        <div className="mt-20 bg-white dark:bg-slate-800 rounded-card p-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">
            Prinsip Kami
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                Clarity First
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Fokus pada kejelasan dan readability, bukan deception.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                Meaning Preservation
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Jaga makna asli dengan ketat. Tidak mengubah fakta atau data.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                Transparency
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Disclosure option untuk menambahkan catatan penggunaan alat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-card border border-slate-200 dark:border-slate-700">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm">{description}</p>
    </div>
  );
}
