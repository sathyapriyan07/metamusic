import Image from "next/image";

import { Badge } from "@/components/ui/badge";

interface ArtistBannerProps {
  name: string;
  bio: string;
  country: string;
  debutYear: number;
  imageUrl?: string;
}

export function ArtistBanner({
  name,
  bio,
  country,
  debutYear,
  imageUrl,
}: ArtistBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/10 p-8">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="absolute inset-0 -z-10 object-cover opacity-25"
        />
      ) : null}
      <div className="relative z-10 max-w-2xl space-y-4">
        <Badge>Artist</Badge>
        <h1 className="text-3xl font-semibold md:text-4xl">{name}</h1>
        <p className="text-sm text-muted-foreground">{bio}</p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>{country}</span>
          <span>Debut {debutYear}</span>
        </div>
      </div>
    </section>
  );
}
