import Image from "next/image";
import Link from "next/link";

interface GenreCard {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export function GenreGrid({ genres }: { genres: GenreCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {genres.map((genre) => (
        <Link
          key={genre.id}
          href={`/genre/${genre.id}`}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/30"
        >
          {genre.imageUrl ? (
            <Image
              src={genre.imageUrl}
              alt={genre.name}
              fill
              className="absolute inset-0 -z-10 object-cover opacity-40 transition group-hover:scale-105"
            />
          ) : null}
          <div className="relative z-10">
            <p className="text-lg font-semibold">{genre.name}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {genre.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
