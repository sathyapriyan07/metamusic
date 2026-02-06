import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PlatformButtons } from "@/components/sections/platform-buttons";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface PlaylistPageProps {
  params: { id: string };
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const supabase = createSupabaseServerClient();
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabase) {
    return null;
  }

  let playlist = {
    title: "",
    description: "",
    cover_url: "",
  };

  let songs: Array<{ id: string; title: string; artist: string }> = [];

  const { data: playlistRow } = await supabase
    .from("playlists")
    .select("title,description,cover_url")
    .eq("id", params.id)
    .single();

  if (playlistRow) {
    playlist = {
      title: playlistRow.title,
      description: playlistRow.description ?? "",
      cover_url: playlistRow.cover_url ?? "",
    };
  }

  const { data: songRows } = await supabase
    .from("playlist_songs")
    .select("song:songs(id,title,artists(name))")
    .eq("playlist_id", params.id);

  if (songRows) {
    songs = songRows
      .map((row) => row.song)
      .filter(Boolean)
      .map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artists?.name ?? "Unknown Artist",
      }));
  }

  return (
    <div className="space-y-8">
      <Card className="flex flex-col gap-6 lg:flex-row">
        <div className="relative h-56 w-56 overflow-hidden rounded-3xl">
          {playlist.cover_url ? (
            <Image src={playlist.cover_url} alt="Playlist cover" fill className="object-cover" />
          ) : null}
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Playlist
            </p>
            <h1 className="text-3xl font-semibold">{playlist.title}</h1>
            <p className="text-sm text-muted-foreground">Curated by MetaMusic</p>
          </div>
          <p className="text-sm text-muted-foreground">{playlist.description}</p>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Tracks</h2>
        <div className="space-y-3">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <Link href={`/song/${song.id}`} className="text-sm font-semibold hover:underline">
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
    </div>
  );
}
