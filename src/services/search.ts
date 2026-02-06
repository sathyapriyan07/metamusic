import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Album, Artist, Playlist, Song } from "@/types";

const supabase = createSupabaseBrowserClient();

export async function searchAll(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      songs: [] as (Song & { artist?: { name: string } | null })[],
      albums: [] as (Album & { artist?: { name: string } | null })[],
      artists: [] as Artist[],
      playlists: [] as Playlist[],
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
    songs: (songs.data ?? []) as (Song & { artist?: { name: string } | null })[],
    albums: (albums.data ?? []) as (Album & { artist?: { name: string } | null })[],
    artists: (artists.data ?? []) as Artist[],
    playlists: (playlists.data ?? []) as Playlist[],
  };
}
