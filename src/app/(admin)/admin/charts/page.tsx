"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminTable } from "@/components/sections/admin-table";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface ChartRow {
  id: string;
  type: string;
  reference_id: string;
  rank: number;
  week: string;
}

export default function AdminChartsPage() {
  const supabase = createSupabaseBrowserClient();
  const [charts, setCharts] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("charts")
      .select("id,type,reference_id,rank,week")
      .order("week", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!active) return;
        setCharts((data ?? []) as ChartRow[]);
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
      rank: Number(formData.get("rank") || 0) || 0,
      week: String(formData.get("week") || ""),
    };
    const { data } = await supabase.from("charts").insert(payload).select().single();
    if (data) {
      setCharts((prev) => [data as ChartRow, ...prev]);
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
      rank: Number(formData.get("rank") || 0) || 0,
      week: String(formData.get("week") || ""),
    };
    const { data } = await supabase.from("charts").update(payload).eq("id", id).select().single();
    if (data) {
      setCharts((prev) => prev.map((item) => (item.id === id ? (data as ChartRow) : item)));
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("charts").delete().eq("id", id);
    setCharts((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Charts</h1>
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="type" placeholder="Type (song/album/artist)" required />
            <Input name="reference_id" placeholder="Reference ID" required />
            <Input name="rank" placeholder="Rank" required />
            <Input name="week" placeholder="Week (YYYY-MM-DD)" required />
          </div>
          <Button className="w-fit" type="submit">
            Create Chart Entry
          </Button>
        </form>
      </Card>

      <AdminTable title="Chart Entries" action={<Button variant="secondary">Export</Button>}>
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          charts.map((chart) => (
            <div
              key={chart.id}
              className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{chart.type} · Rank {chart.rank}</p>
                  <p className="text-xs text-muted-foreground">Week {chart.week}</p>
                </div>
                <Button size="sm" variant="outline" type="button" onClick={() => handleDelete(chart.id)}>
                  Delete
                </Button>
              </div>
              <form onSubmit={handleUpdate} className="grid gap-2 md:grid-cols-4">
                <input type="hidden" name="id" value={chart.id} />
                <Input name="type" defaultValue={chart.type} placeholder="Type" />
                <Input name="reference_id" defaultValue={chart.reference_id} placeholder="Reference ID" />
                <Input name="rank" defaultValue={chart.rank.toString()} placeholder="Rank" />
                <Input name="week" defaultValue={chart.week} placeholder="Week" />
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
