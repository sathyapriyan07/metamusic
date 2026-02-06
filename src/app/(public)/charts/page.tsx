import { Crown } from "lucide-react";

import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ChartsPage() {
  const supabase = createSupabaseServerClient();
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let charts: Array<{ id: string; rank: number; reference_id: string; type: string }> = [];

  if (hasSupabase) {
    const { data } = await supabase
      .from("charts")
      .select("id,rank,reference_id,type")
      .order("rank", { ascending: true })
      .limit(10);
    charts = data ?? [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Top Charts
          </p>
          <h1 className="text-3xl font-semibold">Top 10 This Week</h1>
        </div>
        <Crown className="h-8 w-8 text-primary" />
      </div>
      <div className="grid gap-4">
        {charts.map((item) => (
          <Card key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-lg font-semibold">
                {item.rank}
              </div>
              <div>
                <p className="text-sm font-semibold">{item.type}</p>
                <p className="text-xs text-muted-foreground">{item.reference_id}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Weekly chart</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
