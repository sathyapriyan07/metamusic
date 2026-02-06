import { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function AdminTable({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[720px] space-y-2">{children}</div>
      </div>
    </Card>
  );
}
