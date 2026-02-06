"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminTable } from "@/components/sections/admin-table";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface SongRow {
  id: string;
  title: string;
  artist_id: string;
  album_id: string | null;
  duration: string | null;
  language: string | null;
  lyrics: string | null;
  cover_url: string | null;
  release_date: string | null;
  is_trending: boolean | null;
  artists?: { name?: string } | null;
}

export default function AdminSongsPage() {
  const supabase = createSupabaseBrowserClient();
  const [songs, setSongs] = useState<SongRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("songs")
      .select("id,title,is_trending,artist_id,album_id,duration,language,lyrics,cover_url,release_date,artists(name)")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!active) return;
        setSongs((data ?? []) as SongRow[]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [supabase]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
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
    const { data } = await supabase.from("songs").insert(payload).select().single();
    if (data) {
      setSongs((prev) => [data as SongRow, ...prev]);
      event.currentTarget.reset();
    }
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
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
    const { data } = await supabase.from("songs").update(payload).eq("id", id).select().single();
    if (data) {
      setSongs((prev) => prev.map((item) => (item.id === id ? (data as SongRow) : item)));
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("songs").delete().eq("id", id);
    setSongs((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Songs</h1>
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="title" placeholder="Song title" required />
            <Input name="artist_id" placeholder="Artist ID" required />
            <Input name="album_id" placeholder="Album ID (optional)" />
            <Input name="duration" placeholder="Duration (e.g. 3:42)" />
            <Input name="language" placeholder="Language" />
            <Input name="release_date" placeholder="Release date (YYYY-MM-DD)" />
            <Input name="cover_url" placeholder="Cover URL" />
            <Input name="lyrics" placeholder="Lyrics" />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" name="is_trending" />
            Trending
          </label>
          <Button className="w-fit" type="submit">
            Create Song
          </Button>
        </form>
      </Card>

      <AdminTable title="Song Records" action={<Button variant="secondary">Export</Button>}>
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          songs.map((song) => (
            <div
              key={song.id}
              className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-xs text-muted-foreground">{song.artists?.name ?? "-"}</p>
                </div>
                <Button size="sm" variant="outline" type="button" onClick={() => handleDelete(song.id)}>
                  Delete
                </Button>
              </div>
              <form onSubmit={handleUpdate} className="grid gap-2 md:grid-cols-3">
                <input type="hidden" name="id" value={song.id} />
                <Input name="title" defaultValue={song.title} placeholder="Title" />
                <Input name="artist_id" defaultValue={song.artist_id} placeholder="Artist ID" />
                <Input name="album_id" defaultValue={song.album_id ?? ""} placeholder="Album ID" />
                <Input name="duration" defaultValue={song.duration ?? ""} placeholder="Duration" />
                <Input name="language" defaultValue={song.language ?? ""} placeholder="Language" />
                <Input name="release_date" defaultValue={song.release_date ?? ""} placeholder="Release date" />
                <Input name="cover_url" defaultValue={song.cover_url ?? ""} placeholder="Cover URL" />
                <Input name="lyrics" defaultValue={song.lyrics ?? ""} placeholder="Lyrics" />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" name="is_trending" defaultChecked={song.is_trending ?? false} />
                  Trending
                </label>
                <Button size="sm" type="submit">
                  Update
                </Button>
              </form>
            </div>
          ))
        )}
      </AdminTable>
    </div>
  );
}
