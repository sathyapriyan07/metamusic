"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function SaveButton({ saved = false }: { saved?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground",
        saved && "text-primary border-primary/40"
      )}
      aria-label="Save item"
    >
      <Heart className={cn("h-4 w-4", saved && "fill-primary")} />
    </motion.button>
  );
}
