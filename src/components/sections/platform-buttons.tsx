import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

const platformStyles: Record<string, string> = {
  Spotify: "bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/30",
  "Apple Music": "bg-[#FC3C44]/20 text-[#FC3C44] hover:bg-[#FC3C44]/30",
  "YouTube Music": "bg-[#FF0000]/20 text-[#FF0000] hover:bg-[#FF0000]/30",
};

export function PlatformButtons({
  links,
}: {
  links: { platform: string; url: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <Button
          key={link.platform}
          variant="secondary"
          className={platformStyles[link.platform] ?? "bg-white/10"}
          asChild
        >
          <Link href={link.url} target="_blank" rel="noreferrer">
            {link.platform}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      ))}
    </div>
  );
}
