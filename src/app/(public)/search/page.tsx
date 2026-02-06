import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaCard } from "@/components/sections/media-card";
import { searchMetadata } from "@/services/search-server";

const types = [
  { value: "songs", label: "Songs" },
  { value: "albums", label: "Albums" },
  { value: "artists", label: "Artists" },
  { value: "playlists", label: "Playlists" },
] as const;

interface SearchPageProps {
  searchParams: {
    q?: string;
    type?: "songs" | "albums" | "artists" | "playlists";
    page?: string;
    genre?: string;
    country?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ?? "";
  const type = searchParams.type ?? "songs";
  const page = Number(searchParams.page ?? "1") || 1;
  const genre = searchParams.genre ?? "";
  const country = searchParams.country ?? "";

  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const pageSize = 12;

  const results = hasSupabase && query
    ? await searchMetadata({
        query,
        type,
        genre: genre || undefined,
        country: country || undefined,
        page,
        pageSize,
      })
    : { items: [], count: 0 };

  const totalPages = Math.max(1, Math.ceil(results.count / pageSize));

  return (
    <div className="space-y-8">
      <form className="sticky top-24 z-20 rounded-3xl border border-white/10 bg-black/60 p-4 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Input
            name="q"
            placeholder="Search the metadata universe"
            defaultValue={query}
          />
          <div className="flex flex-wrap gap-2">
            {types.map((item) => (
              <Button
                key={item.value}
                variant={type === item.value ? "default" : "ghost"}
                asChild
              >
                <Link
                  href={`?q=${encodeURIComponent(query)}&type=${item.value}`}
                >
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Input
            name="genre"
            placeholder="Filter by genre"
            defaultValue={genre}
          />
          <Input
            name="country"
            placeholder="Filter by country"
            defaultValue={country}
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      {!hasSupabase ? (
        <p className="text-xs text-muted-foreground">
          Connect Supabase to enable live search.
        </p>
      ) : null}

      {query ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {results.count} results for "{query}"
            </h2>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {results.items.map((item) => (
              <MediaCard
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                href={item.href}
                imageUrl={item.imageUrl}
                shape={type === "artists" ? "circle" : "square"}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              disabled={page <= 1}
              asChild
            >
              <Link
                href={`?q=${encodeURIComponent(query)}&type=${type}&page=${Math.max(
                  1,
                  page - 1
                )}&genre=${encodeURIComponent(genre)}&country=${encodeURIComponent(
                  country
                )}`}
              >
                Previous
              </Link>
            </Button>
            <Button
              variant="secondary"
              disabled={page >= totalPages}
              asChild
            >
              <Link
                href={`?q=${encodeURIComponent(query)}&type=${type}&page=${Math.min(
                  totalPages,
                  page + 1
                )}&genre=${encodeURIComponent(genre)}&country=${encodeURIComponent(
                  country
                )}`}
              >
                Next
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Type a search term to see results.
        </p>
      )}
    </div>
  );
}
