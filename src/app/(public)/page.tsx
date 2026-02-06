import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crown, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimateIn } from "@/components/motion/animate-in";
import { HorizontalCarousel } from "@/components/sections/horizontal-carousel";
import { MediaCard } from "@/components/sections/media-card";
import { SaveButton } from "@/components/sections/save-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createSupabaseServerClient();
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let songs: Array<{ id: string; title: string; artist: string; coverUrl?: string }> = [];
  let albums: Array<{ id: string; title: string; artist: string; coverUrl?: string }> = [];
  let artists: Array<{ id: string; name: string; genre: string; imageUrl?: string }> = [];
  let featured: Array<{ id: string; title: string; description: string; coverUrl?: string }> = [];
  let topSong: { title: string; artist: string; coverUrl?: string } | null = null;
  let topAlbum: { title: string; artist: string; coverUrl?: string } | null = null;
  let topArtist: { name: string; genre: string; imageUrl?: string } | null = null;

  if (hasSupabase) {
    const [
      { data: songRows },
      { data: albumRows },
      { data: artistRows },
      { data: playlistRows },
      { data: topSongChart },
      { data: topAlbumChart },
      { data: topArtistChart },
    ] = await Promise.all([
        supabase
          .from("songs")
          .select("id,title,cover_url,artist:artists(name)")
          .eq("is_trending", true)
          .limit(12),
        supabase
          .from("albums")
          .select("id,title,cover_url,artist:artists(name)")
          .eq("is_trending", true)
          .limit(12),
        supabase
          .from("artists")
          .select("id,name,image_url,country")
          .eq("is_trending", true)
          .limit(12),
        supabase
          .from("playlists")
          .select("id,title,description,cover_url")
          .eq("is_featured", true)
          .limit(12),
        supabase
          .from("charts")
          .select("reference_id")
          .eq("type", "song")
          .eq("rank", 1)
          .order("week", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("charts")
          .select("reference_id")
          .eq("type", "album")
          .eq("rank", 1)
          .order("week", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("charts")
          .select("reference_id")
          .eq("type", "artist")
          .eq("rank", 1)
          .order("week", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

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
          coverUrl: song.cover_url ?? undefined,
        };
      });
    }
    if (albumRows) {
      albums = albumRows.map((album) => {
        const artistRelation = (album as { artist?: { name?: string } | { name?: string }[] })
          .artist;
        const artistName = Array.isArray(artistRelation)
          ? artistRelation[0]?.name
          : artistRelation?.name;
        return {
          id: album.id,
          title: album.title,
          artist: artistName ?? "Unknown Artist",
          coverUrl: album.cover_url ?? undefined,
        };
      });
    }
    if (artistRows) {
      artists = artistRows.map((artist) => ({
        id: artist.id,
        name: artist.name,
        genre: artist.country ?? "Artist",
        imageUrl: artist.image_url ?? undefined,
      }));
    }
    if (playlistRows) {
      featured = playlistRows.map((playlist) => ({
        id: playlist.id,
        title: playlist.title,
        description: playlist.description ?? "",
        coverUrl: playlist.cover_url ?? undefined,
      }));
    }

    if (topSongChart?.reference_id) {
      const { data: topSongRow } = await supabase
        .from("songs")
        .select("title,cover_url,artist:artists(name)")
        .eq("id", topSongChart.reference_id)
        .single();
      if (topSongRow) {
        const artistRelation = (topSongRow as { artist?: { name?: string } | { name?: string }[] })
          .artist;
        const artistName = Array.isArray(artistRelation)
          ? artistRelation[0]?.name
          : artistRelation?.name;
        topSong = {
          title: topSongRow.title,
          artist: artistName ?? "Unknown Artist",
          coverUrl: topSongRow.cover_url ?? undefined,
        };
      }
    }

    if (topAlbumChart?.reference_id) {
      const { data: topAlbumRow } = await supabase
        .from("albums")
        .select("title,cover_url,artist:artists(name)")
        .eq("id", topAlbumChart.reference_id)
        .single();
      if (topAlbumRow) {
        const artistRelation = (topAlbumRow as { artist?: { name?: string } | { name?: string }[] })
          .artist;
        const artistName = Array.isArray(artistRelation)
          ? artistRelation[0]?.name
          : artistRelation?.name;
        topAlbum = {
          title: topAlbumRow.title,
          artist: artistName ?? "Unknown Artist",
          coverUrl: topAlbumRow.cover_url ?? undefined,
        };
      }
    }

    if (topArtistChart?.reference_id) {
      const { data: topArtistRow } = await supabase
        .from("artists")
        .select("name,image_url,country")
        .eq("id", topArtistChart.reference_id)
        .single();
      if (topArtistRow) {
        topArtist = {
          name: topArtistRow.name,
          genre: topArtistRow.country ?? "Artist",
          imageUrl: topArtistRow.image_url ?? undefined,
        };
      }
    }
  }

  return (
    <div className="space-y-12">
      <AnimateIn>
        <section className="grid gap-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-white/5 p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Music metadata intelligence
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
              Discover the story behind every release.
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              MetaMusic brings together songs, albums, artists, and playlists with rich
              credits, timelines, charts, and streaming links. No audio hosting,
              just curated metadata with a Spotify-inspired experience.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/search">
                  Start exploring <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/charts">
                  View charts <Sparkles className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=1200&q=80"
              alt="Music dashboard"
              fill
              className="object-cover"
            />
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.05}>
        <HorizontalCarousel title="Trending Songs">
          {songs.map((song) => (
            <MediaCard
              key={song.id}
              title={song.title}
              subtitle={song.artist}
              href={`/song/${song.id}`}
              imageUrl={song.coverUrl}
            />
          ))}
        </HorizontalCarousel>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <HorizontalCarousel title="Trending Albums">
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
      </AnimateIn>

      <AnimateIn delay={0.15}>
        <HorizontalCarousel title="Trending Artists">
          {artists.map((artist) => (
            <MediaCard
              key={artist.id}
              title={artist.name}
              subtitle={artist.genre}
              href={`/artist/${artist.id}`}
              imageUrl={artist.imageUrl}
              shape="circle"
            />
          ))}
        </HorizontalCarousel>
      </AnimateIn>

      {(topSong || topAlbum || topArtist) ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {[topSong, topAlbum, topArtist].map((item, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute right-6 top-6">
                <SaveButton />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                  {item && (
                    <Image
                      src={"title" in item ? item.coverUrl ?? "" : item.imageUrl ?? ""}
                      alt={"title" in item ? item.title : item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {index === 0
                      ? "Top Song of the Week"
                      : index === 1
                      ? "Top Album of the Week"
                      : "Top Artist of the Week"}
                  </p>
                  <p className="text-lg font-semibold">
                    {item ? ("title" in item ? item.title : item.name) : "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item
                      ? "title" in item
                        ? item.artist
                        : item.genre
                      : ""}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <AnimateIn delay={0.2}>
        <HorizontalCarousel title="Featured Playlists">
          {featured.map((playlist) => (
            <MediaCard
              key={playlist.id}
              title={playlist.title}
              subtitle={playlist.description}
              href={`/playlist/${playlist.id}`}
              imageUrl={playlist.coverUrl}
              label="Curated"
            />
          ))}
        </HorizontalCarousel>
      </AnimateIn>

      <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Weekly spotlight
          </p>
          <h2 className="text-2xl font-semibold">Build your music intelligence.</h2>
          <p className="text-sm text-muted-foreground">
            Track credits, genres, and performance across streaming platforms.
          </p>
        </div>
        <Button asChild>
          <Link href="/signup">
            Join MetaMusic <Crown className="h-4 w-4" />
          </Link>
        </Button>
      </Card>
    </div>
  );
}
