import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/albums", label: "Albums" },
  { href: "/admin/songs", label: "Songs" },
  { href: "/admin/playlists", label: "Playlists" },
  { href: "/admin/genres", label: "Genres" },
  { href: "/admin/platform-links", label: "Platform Links" },
  { href: "/admin/charts", label: "Charts" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,185,84,0.12),_transparent_55%),linear-gradient(160deg,_rgba(10,12,16,0.96),_rgba(8,9,12,0.96))]">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-6 py-10">
        <aside className="hidden w-56 flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 lg:flex">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Admin
          </p>
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
