import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Album, Artist, Genre, Playlist, Song } from "@/types";

const supabase = createSupabaseBrowserClient();

export async function fetchTrendingSongs() {
  return supabase.from("songs").select("*").eq("is_trending", true) as unknown as {
    data: Song[] | null;
    error: unknown;
  };
}

export async function fetchTrendingAlbums() {
  return supabase.from("albums").select("*").eq("is_trending", true) as unknown as {
    data: Album[] | null;
    error: unknown;
  };
}

export async function fetchTrendingArtists() {
  return supabase.from("artists").select("*").eq("is_trending", true) as unknown as {
    data: Artist[] | null;
    error: unknown;
  };
}

export async function fetchGenres() {
  return supabase.from("genres").select("*") as unknown as {
    data: Genre[] | null;
    error: unknown;
  };
}

export async function fetchPlaylists() {
  return supabase.from("playlists").select("*") as unknown as {
    data: Playlist[] | null;
    error: unknown;
  };
}

export async function fetchSongById(id: string) {
  return supabase.from("songs").select("*").eq("id", id).single() as unknown as {
    data: Song | null;
    error: unknown;
  };
}
