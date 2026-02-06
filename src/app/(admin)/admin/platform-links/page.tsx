"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminTable } from "@/components/sections/admin-table";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface PlatformLinkRow {
  id: string;
  type: string;
  reference_id: string;
  platform_name: string;
  url: string;
  icon_url: string | null;
}

export default function AdminPlatformLinksPage() {
  const supabase = createSupabaseBrowserClient();
  const [links, setLinks] = useState<PlatformLinkRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("platform_links")
      .select("id,type,reference_id,platform_name,url,icon_url")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!active) return;
        setLinks((data ?? []) as PlatformLinkRow[]);
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
      type: String(formData.get("type") || ""),
      reference_id: String(formData.get("reference_id") || ""),
      platform_name: String(formData.get("platform_name") || ""),
      url: String(formData.get("url") || ""),
      icon_url: String(formData.get("icon_url") || "") || null,
    };
    const { data } = await supabase.from("platform_links").insert(payload).select().single();
    if (data) {
      setLinks((prev) => [data as PlatformLinkRow, ...prev]);
      event.currentTarget.reset();
    }
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") || "");
    const payload = {
      type: String(formData.get("type") || ""),
      reference_id: String(formData.get("reference_id") || ""),
      platform_name: String(formData.get("platform_name") || ""),
      url: String(formData.get("url") || ""),
      icon_url: String(formData.get("icon_url") || "") || null,
    };
    const { data } = await supabase.from("platform_links").update(payload).eq("id", id).select().single();
    if (data) {
      setLinks((prev) => prev.map((item) => (item.id === id ? (data as PlatformLinkRow) : item)));
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("platform_links").delete().eq("id", id);
    setLinks((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Platform Links</h1>
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="type" placeholder="Type (song/album/artist/playlist)" required />
            <Input name="reference_id" placeholder="Reference ID" required />
            <Input name="platform_name" placeholder="Platform name" required />
            <Input name="url" placeholder="URL" required />
            <Input name="icon_url" placeholder="Icon URL" />
          </div>
          <Button className="w-fit" type="submit">
            Create Link
          </Button>
        </form>
      </Card>

      <AdminTable title="Platform Links" action={<Button variant="secondary">Export</Button>}>
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{link.platform_name}</p>
                  <p className="text-xs text-muted-foreground">{link.type}</p>
                </div>
                <Button size="sm" variant="outline" type="button" onClick={() => handleDelete(link.id)}>
                  Delete
                </Button>
              </div>
              <form onSubmit={handleUpdate} className="grid gap-2 md:grid-cols-3">
                <input type="hidden" name="id" value={link.id} />
                <Input name="type" defaultValue={link.type} placeholder="Type" />
                <Input name="reference_id" defaultValue={link.reference_id} placeholder="Reference ID" />
                <Input name="platform_name" defaultValue={link.platform_name} placeholder="Platform" />
                <Input name="url" defaultValue={link.url} placeholder="URL" />
                <Input name="icon_url" defaultValue={link.icon_url ?? ""} placeholder="Icon URL" />
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
