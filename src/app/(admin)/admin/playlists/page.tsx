"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminTable } from "@/components/sections/admin-table";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface PlaylistRow {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  created_by_admin: boolean | null;
  is_featured: boolean | null;
}

export default function AdminPlaylistsPage() {
  const supabase = createSupabaseBrowserClient();
  const [playlists, setPlaylists] = useState<PlaylistRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("playlists")
      .select("id,title,description,cover_url,created_by_admin,is_featured")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!active) return;
        setPlaylists((data ?? []) as PlaylistRow[]);
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
      description: String(formData.get("description") || "") || null,
      cover_url: String(formData.get("cover_url") || "") || null,
      created_by_admin: true,
      is_featured: formData.get("is_featured") === "on",
    };
    const { data } = await supabase.from("playlists").insert(payload).select().single();
    if (data) {
      setPlaylists((prev) => [data as PlaylistRow, ...prev]);
      event.currentTarget.reset();
    }
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") || "");
    const payload = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || "") || null,
      cover_url: String(formData.get("cover_url") || "") || null,
      is_featured: formData.get("is_featured") === "on",
    };
    const { data } = await supabase.from("playlists").update(payload).eq("id", id).select().single();
    if (data) {
      setPlaylists((prev) => prev.map((item) => (item.id === id ? (data as PlaylistRow) : item)));
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("playlists").delete().eq("id", id);
    setPlaylists((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Playlists</h1>
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="title" placeholder="Playlist title" required />
            <Input name="description" placeholder="Description" />
            <Input name="cover_url" placeholder="Cover URL" />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" name="is_featured" />
            Featured on home
          </label>
          <Button className="w-fit" type="submit">
            Create Playlist
          </Button>
        </form>
      </Card>

      <AdminTable title="Playlist Records" action={<Button variant="secondary">Export</Button>}>
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{playlist.title}</p>
                  <p className="text-xs text-muted-foreground">{playlist.description ?? ""}</p>
                </div>
                <Button size="sm" variant="outline" type="button" onClick={() => handleDelete(playlist.id)}>
                  Delete
                </Button>
              </div>
              <form onSubmit={handleUpdate} className="grid gap-2 md:grid-cols-3">
                <input type="hidden" name="id" value={playlist.id} />
                <Input name="title" defaultValue={playlist.title} placeholder="Title" />
                <Input name="description" defaultValue={playlist.description ?? ""} placeholder="Description" />
                <Input name="cover_url" defaultValue={playlist.cover_url ?? ""} placeholder="Cover URL" />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" name="is_featured" defaultChecked={playlist.is_featured ?? false} />
                  Featured
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
