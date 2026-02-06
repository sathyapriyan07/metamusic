"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminTable } from "@/components/sections/admin-table";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface ArtistRow {
  id: string;
  name: string;
  country: string | null;
  debut_year: number | null;
  image_url: string | null;
  bio: string | null;
  is_trending: boolean | null;
}

export default function AdminArtistsPage() {
  const supabase = createSupabaseBrowserClient();
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("artists")
      .select("id,name,country,is_trending,debut_year,image_url,bio")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!active) return;
        setArtists((data ?? []) as ArtistRow[]);
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
      name: String(formData.get("name") || ""),
      country: String(formData.get("country") || "") || null,
      debut_year: Number(formData.get("debut_year") || 0) || null,
      image_url: String(formData.get("image_url") || "") || null,
      bio: String(formData.get("bio") || "") || null,
      is_trending: formData.get("is_trending") === "on",
    };
    const { data } = await supabase.from("artists").insert(payload).select().single();
    if (data) {
      setArtists((prev) => [data as ArtistRow, ...prev]);
      event.currentTarget.reset();
    }
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") || "");
    const payload = {
      name: String(formData.get("name") || ""),
      country: String(formData.get("country") || "") || null,
      debut_year: Number(formData.get("debut_year") || 0) || null,
      image_url: String(formData.get("image_url") || "") || null,
      bio: String(formData.get("bio") || "") || null,
      is_trending: formData.get("is_trending") === "on",
    };
    const { data } = await supabase.from("artists").update(payload).eq("id", id).select().single();
    if (data) {
      setArtists((prev) => prev.map((item) => (item.id === id ? (data as ArtistRow) : item)));
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("artists").delete().eq("id", id);
    setArtists((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Artists</h1>
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="name" placeholder="Artist name" required />
            <Input name="country" placeholder="Country" />
            <Input name="debut_year" placeholder="Debut year" />
            <Input name="image_url" placeholder="Image URL" />
            <Input name="bio" placeholder="Bio" />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" name="is_trending" />
            Trending
          </label>
          <Button className="w-fit" type="submit">
            Create Artist
          </Button>
        </form>
      </Card>

      <AdminTable title="Artist Records" action={<Button variant="secondary">Export</Button>}>
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          artists.map((artist) => (
            <div
              key={artist.id}
              className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{artist.name}</p>
                  <p className="text-xs text-muted-foreground">{artist.country ?? "-"}</p>
                </div>
                <Button size="sm" variant="outline" type="button" onClick={() => handleDelete(artist.id)}>
                  Delete
                </Button>
              </div>
              <form onSubmit={handleUpdate} className="grid gap-2 md:grid-cols-3">
                <input type="hidden" name="id" value={artist.id} />
                <Input name="name" defaultValue={artist.name} placeholder="Name" />
                <Input name="country" defaultValue={artist.country ?? ""} placeholder="Country" />
                <Input name="debut_year" defaultValue={artist.debut_year?.toString() ?? ""} placeholder="Debut year" />
                <Input name="image_url" defaultValue={artist.image_url ?? ""} placeholder="Image URL" />
                <Input name="bio" defaultValue={artist.bio ?? ""} placeholder="Bio" />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" name="is_trending" defaultChecked={artist.is_trending ?? false} />
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
