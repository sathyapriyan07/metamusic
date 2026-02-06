import { ArtistBanner } from "@/components/sections/artist-banner";
import { HorizontalCarousel } from "@/components/sections/horizontal-carousel";
import { MediaCard } from "@/components/sections/media-card";
import { PlatformButtons } from "@/components/sections/platform-buttons";
import { Timeline } from "@/components/sections/timeline";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ArtistPageProps {
  params: { id: string };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const supabase = createSupabaseServerClient();
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabase) {
    return null;
  }

  const { data: artistRow } = await supabase
    .from("artists")
    .select("name,bio,country,debut_year,image_url")
    .eq("id", params.id)
    .single();

  const artist = artistRow ?? {
    name: "Unknown Artist",
    bio: "",
    country: "",
    debut_year: 0,
    image_url: "",
  };

  let topSongs: Array<{ id: string; title: string; artist: string }> = [];
  let albums: Array<{ id: string; title: string; artist: string; coverUrl?: string }> = [];
  let relatedArtists: Array<{ id: string; name: string; genre: string; imageUrl?: string }> = [];

  const { data: songRows } = await supabase
    .from("songs")
    .select("id,title,cover_url,artist:artists(name)")
    .eq("artist_id", params.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: albumRows } = await supabase
    .from("albums")
    .select("id,title,cover_url,artist:artists(name)")
    .eq("artist_id", params.id)
    .order("release_date", { ascending: false })
    .limit(8);

  const { data: relatedRows } = await supabase
    .from("artists")
    .select("id,name,image_url,country")
    .neq("id", params.id)
    .limit(6);

  if (songRows) {
    topSongs = songRows.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist?.name ?? "Unknown Artist",
    }));
  }

  if (albumRows) {
    albums = albumRows.map((album) => ({
      id: album.id,
      title: album.title,
      artist: album.artist?.name ?? "Unknown Artist",
      coverUrl: album.cover_url ?? undefined,
    }));
  }

  if (relatedRows) {
    relatedArtists = relatedRows.map((item) => ({
      id: item.id,
      name: item.name,
      genre: item.country ?? "Artist",
      imageUrl: item.image_url ?? undefined,
    }));
  }

  return (
    <div className="space-y-10">
      <ArtistBanner
        name={artist.name}
        bio={artist.bio ?? ""}
        country={artist.country ?? ""}
        debutYear={artist.debut_year ?? 0}
        imageUrl={artist.image_url ?? undefined}
      />

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Top Songs</h2>
        <div className="grid gap-3">
          {topSongs.slice(0, 3).map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <Link
                  href={`/song/${song.id}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {song.title}
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

      <HorizontalCarousel title="Albums">
        {albums.map((album) => (
          <MediaCard
            key={album.id}
            title={album.title}
            subtitle={album.artist}
            href={`/album/${album.id}`}
            imageUrl={album.coverUrl}
          />
        ))}
      </HorizontalCarousel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Discography Timeline</h2>
          <Timeline
            items={[
              {
                year: "2016",
                title: "Debut EP",
                description: "First independent release exploring synth textures.",
              },
              {
                year: "2019",
                title: "Velocity Dreams",
                description: "Breakthrough album featuring cinematic collaborations.",
              },
              {
                year: "2024",
                title: "Neon Phase",
                description: "Latest era with immersive visual storytelling.",
              },
            ]}
          />
        </Card>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Related Artists</h2>
          <div className="space-y-3">
            {relatedArtists.map((artistItem) => (
              <div
                key={artistItem.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">{artistItem.name}</p>
                  <p className="text-xs text-muted-foreground">{artistItem.genre}</p>
                </div>
                <span className="text-xs text-muted-foreground">Explore</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">External Platforms</h2>
        <PlatformButtons
          links={[
            { platform: "Spotify", url: "https://open.spotify.com" },
            { platform: "Apple Music", url: "https://music.apple.com" },
            { platform: "YouTube Music", url: "https://music.youtube.com" },
          ]}
        />
      </Card>
    </div>
  );
}
