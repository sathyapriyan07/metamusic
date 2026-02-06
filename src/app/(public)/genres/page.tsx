import { GenreGrid } from "@/components/sections/genre-grid";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function GenresPage() {
  const supabase = createSupabaseServerClient();
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let genres: Array<{ id: string; name: string; description: string; imageUrl?: string }> = [];

  if (hasSupabase) {
    const { data } = await supabase
      .from("genres")
      .select("id,name,description,image_url")
      .order("name", { ascending: true });

    if (data) {
      genres = data.map((genre) => ({
        id: genre.id,
        name: genre.name,
        description: genre.description ?? "",
        imageUrl: genre.image_url ?? undefined,
      }));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Browse
        </p>
        <h1 className="text-3xl font-semibold">Genres</h1>
      </div>
      <GenreGrid genres={genres} />
    </div>
  );
}
