import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SearchParams {
  query: string;
  type: "songs" | "albums" | "artists" | "playlists";
  genre?: string;
  country?: string;
  page: number;
  pageSize: number;
}

export async function searchMetadata(params: SearchParams) {
  const supabase = createSupabaseServerClient();
  const { query, type, genre, country, page, pageSize } = params;
  const offset = (page - 1) * pageSize;
  const limit = pageSize - 1;
  const pattern = `%${query}%`;

  if (type === "songs") {
    const { data, count } = await supabase
      .from("songs")
      .select("id,title,cover_url,artists(name)", { count: "exact" })
      .or(`title.ilike.${pattern},language.ilike.${pattern}`)
      .range(offset, offset + limit);

    return {
      items: (data ?? []).map((song) => ({
        id: song.id,
        title: song.title,
        subtitle: song.artists?.name ?? "Unknown Artist",
        imageUrl: song.cover_url ?? undefined,
        href: `/song/${song.id}`,
      })),
      count: count ?? 0,
    };
  }

  if (type === "albums") {
    let queryBuilder = supabase
      .from("albums")
      .select("id,title,cover_url,genre,artists(name)", { count: "exact" })
      .or(`title.ilike.${pattern},genre.ilike.${pattern}`);

    if (genre) {
      queryBuilder = queryBuilder.ilike("genre", `%${genre}%`);
    }

    const { data, count } = await queryBuilder.range(offset, offset + limit);

    return {
      items: (data ?? []).map((album) => ({
        id: album.id,
        title: album.title,
        subtitle: album.artists?.name ?? album.genre ?? "Unknown Artist",
        imageUrl: album.cover_url ?? undefined,
        href: `/album/${album.id}`,
      })),
      count: count ?? 0,
    };
  }

  if (type === "artists") {
    let queryBuilder = supabase
      .from("artists")
      .select("id,name,image_url,country", { count: "exact" })
      .or(`name.ilike.${pattern},country.ilike.${pattern}`);

    if (country) {
      queryBuilder = queryBuilder.ilike("country", `%${country}%`);
    }

    const { data, count } = await queryBuilder.range(offset, offset + limit);

    return {
      items: (data ?? []).map((artist) => ({
        id: artist.id,
        title: artist.name,
        subtitle: artist.country ?? "Artist",
        imageUrl: artist.image_url ?? undefined,
        href: `/artist/${artist.id}`,
      })),
      count: count ?? 0,
    };
  }

  const { data, count } = await supabase
    .from("playlists")
    .select("id,title,description,cover_url", { count: "exact" })
    .or(`title.ilike.${pattern},description.ilike.${pattern}`)
    .range(offset, offset + limit);

  return {
    items: (data ?? []).map((playlist) => ({
      id: playlist.id,
      title: playlist.title,
      subtitle: playlist.description ?? "",
      imageUrl: playlist.cover_url ?? undefined,
      href: `/playlist/${playlist.id}`,
    })),
    count: count ?? 0,
  };
}
