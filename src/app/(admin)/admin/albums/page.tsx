"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminTable } from "@/components/sections/admin-table";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface AlbumRow {
  id: string;
  title: string;
  artist_id: string;
  release_date: string | null;
  cover_url: string | null;
  genre: string | null;
  description: string | null;
  is_trending: boolean | null;
  artists?: { name?: string } | null;
}

export default function AdminAlbumsPage() {
  const supabase = createSupabaseBrowserClient();
  const [albums, setAlbums] = useState<AlbumRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("albums")
      .select("id,title,is_trending,artist_id,release_date,cover_url,genre,description,artists(name)")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!active) return;
        setAlbums((data ?? []) as AlbumRow[]);
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
      release_date: String(formData.get("release_date") || "") || null,
      cover_url: String(formData.get("cover_url") || "") || null,
      genre: String(formData.get("genre") || "") || null,
      description: String(formData.get("description") || "") || null,
      is_trending: formData.get("is_trending") === "on",
    };
    const { data } = await supabase.from("albums").insert(payload).select().single();
    if (data) {
      setAlbums((prev) => [data as AlbumRow, ...prev]);
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
      release_date: String(formData.get("release_date") || "") || null,
      cover_url: String(formData.get("cover_url") || "") || null,
      genre: String(formData.get("genre") || "") || null,
      description: String(formData.get("description") || "") || null,
      is_trending: formData.get("is_trending") === "on",
    };
    const { data } = await supabase.from("albums").update(payload).eq("id", id).select().single();
    if (data) {
      setAlbums((prev) => prev.map((item) => (item.id === id ? (data as AlbumRow) : item)));
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("albums").delete().eq("id", id);
    setAlbums((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Albums</h1>
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="title" placeholder="Album title" required />
            <Input name="artist_id" placeholder="Artist ID" required />
            <Input name="release_date" placeholder="Release date (YYYY-MM-DD)" />
            <Input name="cover_url" placeholder="Cover URL" />
            <Input name="genre" placeholder="Genre" />
            <Input name="description" placeholder="Description" />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" name="is_trending" />
            Trending
          </label>
          <Button className="w-fit" type="submit">
            Create Album
          </Button>
        </form>
      </Card>

      <AdminTable title="Album Records" action={<Button variant="secondary">Export</Button>}>
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          albums.map((album) => (
            <div
              key={album.id}
              className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{album.title}</p>
                  <p className="text-xs text-muted-foreground">{album.artists?.name ?? "-"}</p>
                </div>
                <Button size="sm" variant="outline" type="button" onClick={() => handleDelete(album.id)}>
                  Delete
                </Button>
              </div>
              <form onSubmit={handleUpdate} className="grid gap-2 md:grid-cols-3">
                <input type="hidden" name="id" value={album.id} />
                <Input name="title" defaultValue={album.title} placeholder="Title" />
                <Input name="artist_id" defaultValue={album.artist_id} placeholder="Artist ID" />
                <Input name="release_date" defaultValue={album.release_date ?? ""} placeholder="Release date" />
                <Input name="cover_url" defaultValue={album.cover_url ?? ""} placeholder="Cover URL" />
                <Input name="genre" defaultValue={album.genre ?? ""} placeholder="Genre" />
                <Input name="description" defaultValue={album.description ?? ""} placeholder="Description" />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" name="is_trending" defaultChecked={album.is_trending ?? false} />
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
