import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function HorizontalCarousel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
        {children}
      </div>
    </section>
  );
}
