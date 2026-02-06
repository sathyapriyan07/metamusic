import Image from "next/image";
import Link from "next/link";
import { Music2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MediaCardProps {
  title: string;
  subtitle: string;
  href: string;
  imageUrl?: string;
  label?: string;
  shape?: "square" | "circle";
}

export function MediaCard({
  title,
  subtitle,
  href,
  imageUrl,
  label,
  shape = "square",
}: MediaCardProps) {
  return (
    <Link
      href={href}
      className="group flex min-w-[220px] flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
    >
      <div
        className={cn(
          "relative overflow-hidden bg-black/40",
          shape === "circle" ? "h-40 w-40 rounded-full" : "aspect-square rounded-2xl"
        )}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {label ? <Badge className="w-fit">{label}</Badge> : null}
    </Link>
  );
}
