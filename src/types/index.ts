export type PlatformName = "Spotify" | "Apple Music" | "YouTube Music";

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image_url?: string | null;
  country?: string | null;
  debut_year?: number | null;
  is_trending?: boolean | null;
  socials?: Record<string, string> | null;
}

export interface Album {
  id: string;
  title: string;
  artist_id: string;
  cover_url?: string | null;
  genre?: string | null;
  release_date?: string | null;
  description?: string | null;
  is_trending?: boolean | null;
}

export interface Song {
  id: string;
  title: string;
  album_id?: string | null;
  artist_id: string;
  duration?: string | null;
  language?: string | null;
  lyrics?: string | null;
  cover_url?: string | null;
  release_date?: string | null;
  is_trending?: boolean | null;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  created_by_admin?: boolean | null;
}

export interface Genre {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
}

export interface PlatformLink {
  id: string;
  type: "song" | "album" | "artist" | "playlist";
  reference_id: string;
  platform_name: PlatformName;
  url: string;
  icon_url?: string | null;
}

export interface ChartItem {
  id: string;
  type: "song" | "album" | "artist";
  reference_id: string;
  rank: number;
  week: string;
}

export interface UserSaved {
  id: string;
  user_id: string;
  type: "song" | "album" | "artist" | "playlist";
  reference_id: string;
}
