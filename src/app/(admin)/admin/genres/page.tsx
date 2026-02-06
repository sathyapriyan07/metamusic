"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminTable } from "@/components/sections/admin-table";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface GenreRow {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

export default function AdminGenresPage() {
  const supabase = createSupabaseBrowserClient();
  const [genres, setGenres] = useState<GenreRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("genres")
      .select("id,name,description,image_url")
      .order("name", { ascending: true })
      .then(({ data }) => {
        if (!active) return;
        setGenres((data ?? []) as GenreRow[]);
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
      description: String(formData.get("description") || "") || null,
      image_url: String(formData.get("image_url") || "") || null,
    };
    const { data } = await supabase.from("genres").insert(payload).select().single();
    if (data) {
      setGenres((prev) => [data as GenreRow, ...prev]);
      event.currentTarget.reset();
    }
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") || "");
    const payload = {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || "") || null,
      image_url: String(formData.get("image_url") || "") || null,
    };
    const { data } = await supabase.from("genres").update(payload).eq("id", id).select().single();
    if (data) {
      setGenres((prev) => prev.map((item) => (item.id === id ? (data as GenreRow) : item)));
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("genres").delete().eq("id", id);
    setGenres((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Genres</h1>
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="name" placeholder="Genre name" required />
            <Input name="image_url" placeholder="Image URL" />
            <Input name="description" placeholder="Description" />
          </div>
          <Button className="w-fit" type="submit">
            Create Genre
          </Button>
        </form>
      </Card>

      <AdminTable title="Genre Records" action={<Button variant="secondary">Export</Button>}>
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          genres.map((genre) => (
            <div
              key={genre.id}
              className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{genre.name}</p>
                  <p className="text-xs text-muted-foreground">{genre.description}</p>
                </div>
                <Button size="sm" variant="outline" type="button" onClick={() => handleDelete(genre.id)}>
                  Delete
                </Button>
              </div>
              <form onSubmit={handleUpdate} className="grid gap-2 md:grid-cols-3">
                <input type="hidden" name="id" value={genre.id} />
                <Input name="name" defaultValue={genre.name} placeholder="Name" />
                <Input name="image_url" defaultValue={genre.image_url ?? ""} placeholder="Image URL" />
                <Input name="description" defaultValue={genre.description ?? ""} placeholder="Description" />
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
