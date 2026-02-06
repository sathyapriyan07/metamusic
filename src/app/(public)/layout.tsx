import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { PageTransition } from "@/components/motion/page-transition";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,185,84,0.12),_transparent_55%),linear-gradient(160deg,_rgba(10,12,16,0.96),_rgba(8,9,12,0.96))]">
      <Navbar />
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 pb-24">
        <Sidebar />
        <main className="flex-1 pt-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
