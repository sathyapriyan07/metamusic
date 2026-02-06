"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createArtist(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const payload = {
    name: String(formData.get("name") || ""),
    country: String(formData.get("country") || ""),
    debut_year: Number(formData.get("debut_year") || 0) || null,
    image_url: String(formData.get("image_url") || "") || null,
    bio: String(formData.get("bio") || "") || null,
    is_trending: formData.get("is_trending") === "on",
  };
  await supabase.from("artists").insert(payload);
}

export async function updateArtist(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || ""),
    country: String(formData.get("country") || ""),
    debut_year: Number(formData.get("debut_year") || 0) || null,
    image_url: String(formData.get("image_url") || "") || null,
    bio: String(formData.get("bio") || "") || null,
    is_trending: formData.get("is_trending") === "on",
  };
  await supabase.from("artists").update(payload).eq("id", id);
}

export async function deleteArtist(id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("artists").delete().eq("id", id);
}

export async function createAlbum(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const payload = {
    title: String(formData.get("title") || ""),
    artist_id: String(formData.get("artist_id") || ""),
    release_date: String(formData.get("release_date") || "") || null,
    cover_url: String(formData.get("cover_url") || "") || null,
    genre: String(formData.get("genre") || "") || null,
    description: String(formData.get("description") || "") || null,
    is_trending: formData.get("is_trending") === "on",
  };
  await supabase.from("albums").insert(payload);
}

export async function updateAlbum(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const payload = {
    title: String(formData.get("title") || ""),
    artist_id: String(formData.get("artist_id") || ""),
    release_date: String(formData.get("release_date") || "") || null,
    cover_url: String(formData.get("cover_url") || "") || null,
    genre: String(formData.get("genre") || "") || null,
    description: String(formData.get("description") || "") || null,
    is_trending: formData.get("is_trending") === "on",
  };
  await supabase.from("albums").update(payload).eq("id", id);
}

export async function deleteAlbum(id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("albums").delete().eq("id", id);
}

export async function createSong(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const payload = {
    title: String(formData.get("title") || ""),
    artist_id: String(formData.get("artist_id") || ""),
    album_id: String(formData.get("album_id") || "") || null,
    duration: String(formData.get("duration") || "") || null,
    language: String(formData.get("language") || "") || null,
    lyrics: String(formData.get("lyrics") || "") || null,
    cover_url: String(formData.get("cover_url") || "") || null,
    release_date: String(formData.get("release_date") || "") || null,
    is_trending: formData.get("is_trending") === "on",
  };
  await supabase.from("songs").insert(payload);
}

export async function updateSong(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const payload = {
    title: String(formData.get("title") || ""),
    artist_id: String(formData.get("artist_id") || ""),
    album_id: String(formData.get("album_id") || "") || null,
    duration: String(formData.get("duration") || "") || null,
    language: String(formData.get("language") || "") || null,
    lyrics: String(formData.get("lyrics") || "") || null,
    cover_url: String(formData.get("cover_url") || "") || null,
    release_date: String(formData.get("release_date") || "") || null,
    is_trending: formData.get("is_trending") === "on",
  };
  await supabase.from("songs").update(payload).eq("id", id);
}

export async function deleteSong(id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("songs").delete().eq("id", id);
}

export async function createPlaylist(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const payload = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || "") || null,
    cover_url: String(formData.get("cover_url") || "") || null,
    created_by_admin: true,
    is_featured: formData.get("is_featured") === "on",
  };
  await supabase.from("playlists").insert(payload);
}

export async function updatePlaylist(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const payload = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || "") || null,
    cover_url: String(formData.get("cover_url") || "") || null,
    is_featured: formData.get("is_featured") === "on",
  };
  await supabase.from("playlists").update(payload).eq("id", id);
}

export async function deletePlaylist(id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("playlists").delete().eq("id", id);
}

export async function createGenre(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const payload = {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || "") || null,
    image_url: String(formData.get("image_url") || "") || null,
  };
  await supabase.from("genres").insert(payload);
}

export async function updateGenre(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || "") || null,
    image_url: String(formData.get("image_url") || "") || null,
  };
  await supabase.from("genres").update(payload).eq("id", id);
}

export async function deleteGenre(id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("genres").delete().eq("id", id);
}

export async function createPlatformLink(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const payload = {
    type: String(formData.get("type") || ""),
    reference_id: String(formData.get("reference_id") || ""),
    platform_name: String(formData.get("platform_name") || ""),
    url: String(formData.get("url") || ""),
    icon_url: String(formData.get("icon_url") || "") || null,
  };
  await supabase.from("platform_links").insert(payload);
}

export async function updatePlatformLink(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const payload = {
    type: String(formData.get("type") || ""),
    reference_id: String(formData.get("reference_id") || ""),
    platform_name: String(formData.get("platform_name") || ""),
    url: String(formData.get("url") || ""),
    icon_url: String(formData.get("icon_url") || "") || null,
  };
  await supabase.from("platform_links").update(payload).eq("id", id);
}

export async function deletePlatformLink(id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("platform_links").delete().eq("id", id);
}

export async function createChart(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const payload = {
    type: String(formData.get("type") || ""),
    reference_id: String(formData.get("reference_id") || ""),
    rank: Number(formData.get("rank") || 0) || 0,
    week: String(formData.get("week") || ""),
  };
  await supabase.from("charts").insert(payload);
}

export async function updateChart(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const payload = {
    type: String(formData.get("type") || ""),
    reference_id: String(formData.get("reference_id") || ""),
    rank: Number(formData.get("rank") || 0) || 0,
    week: String(formData.get("week") || ""),
  };
  await supabase.from("charts").update(payload).eq("id", id);
}

export async function deleteChart(id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("charts").delete().eq("id", id);
}
