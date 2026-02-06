import Image from "next/image";

import { Card } from "@/components/ui/card";
import { PlatformButtons } from "@/components/sections/platform-buttons";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface SongPageProps {
  params: { id: string };
}

export default async function SongPage({ params }: SongPageProps) {
  const supabase = createSupabaseServerClient();
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let song = {
    title: "Midnight Skyline",
    artist: "Nova Dusk",
    cover_url:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80",
    duration: "3:42",
    language: "English",
    lyrics:
      "We are the neon tide, a skyline in motion. Midnight calls, the city sings, and we drift through the glow.",
    release_date: "2024-11-18",
    album: "Velocity Dreams",
  };

  if (hasSupabase) {
  const { data: songRow } = await supabase
    .from("songs")
    .select("title,cover_url,duration,language,lyrics,release_date,albums(title),artist:artists(name)")
      .eq("id", params.id)
      .single();

    if (songRow) {
      const artistRelation = (songRow as { artist?: { name?: string } | { name?: string }[] })
        .artist;
      const artistName = Array.isArray(artistRelation)
        ? artistRelation[0]?.name
        : artistRelation?.name;
      const albumRelation = (songRow as { albums?: { title?: string } | { title?: string }[] })
        .albums;
      const albumTitle = Array.isArray(albumRelation)
        ? albumRelation[0]?.title
        : albumRelation?.title;
      song = {
        title: songRow.title,
        artist: artistName ?? "Unknown Artist",
        cover_url: songRow.cover_url ?? song.cover_url,
        duration: songRow.duration ?? "",
        language: songRow.language ?? "",
        lyrics: songRow.lyrics ?? "",
        release_date: songRow.release_date?.toString() ?? "",
        album: albumTitle ?? "",
      };
    }
  }

  return (
    <div className="space-y-8">
      <Card className="flex flex-col gap-6 lg:flex-row">
        <div className="relative h-48 w-48 overflow-hidden rounded-3xl">
          <Image src={song.cover_url} alt="Song cover" fill className="object-cover" />
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Song
            </p>
            <h1 className="text-3xl font-semibold">{song.title}</h1>
            <p className="text-sm text-muted-foreground">
              {song.artist} · {song.duration} · {song.language}
            </p>
          </div>
          <PlatformButtons
            links={[
              { platform: "Spotify", url: "https://open.spotify.com" },
              { platform: "Apple Music", url: "https://music.apple.com" },
              { platform: "YouTube Music", url: "https://music.youtube.com" },
            ]}
          />
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Lyrics</h2>
        <p className="text-sm text-muted-foreground">{song.lyrics}</p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Metadata</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Release Date</p>
            <p className="text-sm">{song.release_date}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Language</p>
            <p className="text-sm">{song.language}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Album</p>
            <p className="text-sm">{song.album}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
