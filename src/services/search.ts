import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const supabase = createSupabaseBrowserClient();

export async function searchAll(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      songs: [] as Array<{ id: string; title: string; cover_url?: string | null; artist?: { name: string } | null }>,
      albums: [] as Array<{ id: string; title: string; cover_url?: string | null; artist?: { name: string } | null }>,
      artists: [] as Array<{ id: string; name: string; image_url?: string | null; country?: string | null }>,
      playlists: [] as Array<{ id: string; title: string; description?: string | null; cover_url?: string | null }>,
    };
  }

  const pattern = `%${trimmed}%`;

  const [songs, albums, artists, playlists] = await Promise.all([
    supabase
      .from("songs")
      .select("id,title,cover_url,artist:artists(name)")
      .or(`title.ilike.${pattern},language.ilike.${pattern}`)
      .limit(24),
    supabase
      .from("albums")
      .select("id,title,cover_url,artist:artists(name)")
      .or(`title.ilike.${pattern},genre.ilike.${pattern}`)
      .limit(24),
    supabase
      .from("artists")
      .select("id,name,image_url,bio,country,debut_year,is_trending")
      .or(`name.ilike.${pattern},country.ilike.${pattern}`)
      .limit(24),
    supabase
      .from("playlists")
      .select("id,title,description,cover_url")
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .limit(24),
  ]);

  return {
    songs: (songs.data ?? []).map((song) => {
      const artistRelation = (song as { artist?: { name?: string } | { name?: string }[] })
        .artist;
      const artistName = Array.isArray(artistRelation)
        ? artistRelation[0]?.name
        : artistRelation?.name;
      return {
        id: song.id,
        title: song.title,
        cover_url: song.cover_url ?? null,
        artist: artistName ? { name: artistName } : null,
      };
    }),
    albums: (albums.data ?? []).map((album) => {
      const artistRelation = (album as { artist?: { name?: string } | { name?: string }[] })
        .artist;
      const artistName = Array.isArray(artistRelation)
        ? artistRelation[0]?.name
        : artistRelation?.name;
      return {
        id: album.id,
        title: album.title,
        cover_url: album.cover_url ?? null,
        artist: artistName ? { name: artistName } : null,
      };
    }),
    artists: (artists.data ?? []) as unknown as Array<{ id: string; name: string; image_url?: string | null; country?: string | null }>,
    playlists: (playlists.data ?? []) as unknown as Array<{ id: string; title: string; description?: string | null; cover_url?: string | null }>,
  };
}
