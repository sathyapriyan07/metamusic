import { notFound } from "next/navigation";

import { GenreGrid } from "@/components/sections/genre-grid";
import { MediaCard } from "@/components/sections/media-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface GenrePageProps {
  params: { id: string };
}

export default async function GenreDetailPage({ params }: GenrePageProps) {
  const supabase = createSupabaseServerClient();
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabase) {
    notFound();
  }

  const { data: genre } = await supabase
    .from("genres")
    .select("id,name,description,image_url")
    .eq("id", params.id)
    .single();

  if (!genre) {
    notFound();
  }

  const { data: songRows } = await supabase
    .from("songs")
    .select("id,title,cover_url,artist:artists(name)")
    .eq("is_trending", true)
    .limit(12);

  const { data: relatedGenres } = await supabase
    .from("genres")
    .select("id,name,description,image_url")
    .neq("id", genre.id)
    .limit(8);

  const songs = (songRows ?? []).map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist?.name ?? "Unknown Artist",
    coverUrl: song.cover_url ?? undefined,
  }));

  const genreItems = (relatedGenres ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    imageUrl: item.image_url ?? undefined,
  }));

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Genre
        </p>
        <h1 className="text-3xl font-semibold">{genre.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{genre.description}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Trending in {genre.name}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {songs.map((song) => (
            <MediaCard
              key={song.id}
              title={song.title}
              subtitle={song.artist}
              href={`/song/${song.id}`}
              imageUrl={song.coverUrl}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Explore related genres</h2>
        <div className="mt-4">
          <GenreGrid genres={genreItems} />
        </div>
      </div>
    </div>
  );
}
