import { Card } from "@/components/ui/card";

const stats = [
  { label: "Artists", value: 142 },
  { label: "Albums", value: 516 },
  { label: "Songs", value: 8204 },
  { label: "Playlists", value: 62 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Admin
        </p>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Admin Actions</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Toggle trending items",
            "Update top charts rank",
            "Manage platform links",
            "Review pending metadata",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
