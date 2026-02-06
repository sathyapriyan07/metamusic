import Link from "next/link";
import { Album, BarChart3, Compass, Headphones, Library, User } from "lucide-react";

const links = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/charts", label: "Top Charts", icon: BarChart3 },
  { href: "/genres", label: "Genres", icon: Library },
  { href: "/search", label: "Search", icon: Headphones },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/admin", label: "Admin", icon: Album },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col gap-6 px-6 py-8 lg:flex">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Navigate
        </p>
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-white/10 hover:bg-white/5 hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold">Your Library</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Save songs, albums, artists, and playlists to access them quickly.
        </p>
        <Link
          href="/profile"
          className="mt-4 inline-flex text-xs font-semibold text-primary"
        >
          View saved items
        </Link>
      </div>
    </aside>
  );
}
