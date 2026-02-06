interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.year}-${item.title}`} className="flex gap-4">
          <div className="w-16 text-xs text-muted-foreground">{item.year}</div>
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
