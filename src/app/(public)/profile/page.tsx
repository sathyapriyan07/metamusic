"use client";

import { Bookmark } from "lucide-react";

import { useSession } from "@/hooks/use-session";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user } = useSession();

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Profile
          </p>
          <h1 className="text-3xl font-semibold">
            {user?.email ?? "Guest Listener"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Saved items sync across devices with Supabase Auth.
          </p>
        </div>
        <Button variant="secondary">
          <Bookmark className="h-4 w-4" />
          Manage Saved Items
        </Button>
      </Card>

      <Card className="text-sm text-muted-foreground">
        No saved items yet.
      </Card>
    </div>
  );
}
