import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PlatformButtons } from "@/components/sections/platform-buttons";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface AlbumPageProps {
  params: { id: string };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const supabase = createSupabaseServerClient();
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabase) {
    return null;
  }

  let album = {
    title: "",
    artist: "",
    cover_url: "",
    description: "",
    release_date: "",
  };

  let songs: Array<{ id: string; title: string; artist: string }> = [];

  const { data: albumRow } = await supabase
    .from("albums")
    .select("title,cover_url,description,release_date,artist:artists(name)")
    .eq("id", params.id)
    .single();

  if (albumRow) {
    const artistRelation = (albumRow as { artist?: { name?: string } | { name?: string }[] })
      .artist;
    const artistName = Array.isArray(artistRelation)
      ? artistRelation[0]?.name
      : artistRelation?.name;
    album = {
      title: albumRow.title,
      artist: artistName ?? "Unknown Artist",
      cover_url: albumRow.cover_url ?? "",
      description: albumRow.description ?? "",
      release_date: albumRow.release_date?.toString() ?? "",
    };
  }

  const { data: songRows } = await supabase
    .from("songs")
    .select("id,title,artist:artists(name)")
    .eq("album_id", params.id)
    .order("created_at", { ascending: true });

  if (songRows) {
    songs = songRows.map((song) => {
      const artistRelation = (song as { artist?: { name?: string } | { name?: string }[] })
        .artist;
      const artistName = Array.isArray(artistRelation)
        ? artistRelation[0]?.name
        : artistRelation?.name;
      return {
        id: song.id,
        title: song.title,
        artist: artistName ?? "Unknown Artist",
      };
    });
  }

  return (
    <div className="space-y-8">
      <Card className="flex flex-col gap-6 lg:flex-row">
        <div className="relative h-56 w-56 overflow-hidden rounded-3xl">
          {album.cover_url ? (
            <Image src={album.cover_url} alt="Album cover" fill className="object-cover" />
          ) : null}
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Album
            </p>
            <h1 className="text-3xl font-semibold">{album.title}</h1>
            <p className="text-sm text-muted-foreground">
              {album.artist} · {album.release_date}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{album.description}</p>
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
        <h2 className="text-lg font-semibold">Song List</h2>
        <div className="space-y-3">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <Link
                  href={`/song/${song.id}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {index + 1}. {song.title}
                </Link>
                <p className="text-xs text-muted-foreground">{song.artist}</p>
                <p className="text-xs text-muted-foreground">2024 · 3:42</p>
              </div>
              <PlatformButtons
                links={[
                  { platform: "Spotify", url: "https://open.spotify.com" },
                  { platform: "Apple Music", url: "https://music.apple.com" },
                  { platform: "YouTube Music", url: "https://music.youtube.com" },
                ]}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Artist Credits</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold">{album.artist}</p>
            <p className="text-xs text-muted-foreground">Primary Artist</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
