create extension if not exists "pgcrypto";

-- Profiles for role-based access
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  display_name text,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Core metadata tables
create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  image_url text,
  country text,
  debut_year int,
  is_trending boolean not null default false,
  socials jsonb,
  created_at timestamptz not null default now()
);

create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid not null references artists(id) on delete cascade,
  cover_url text,
  genre text,
  release_date date,
  description text,
  is_trending boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  album_id uuid references albums(id) on delete set null,
  artist_id uuid not null references artists(id) on delete cascade,
  duration text,
  language text,
  lyrics text,
  cover_url text,
  release_date date,
  is_trending boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_url text,
  created_by_admin boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table playlists add column if not exists is_featured boolean not null default false;

create table if not exists genres (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists artist_genres (
  artist_id uuid not null references artists(id) on delete cascade,
  genre_id uuid not null references genres(id) on delete cascade,
  primary key (artist_id, genre_id)
);

create table if not exists playlist_songs (
  playlist_id uuid not null references playlists(id) on delete cascade,
  song_id uuid not null references songs(id) on delete cascade,
  primary key (playlist_id, song_id)
);

create table if not exists platform_links (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('song','album','artist','playlist')),
  reference_id uuid not null,
  platform_name text not null,
  url text not null,
  icon_url text,
  created_at timestamptz not null default now()
);

create table if not exists charts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('song','album','artist')),
  reference_id uuid not null,
  rank int not null,
  week date not null,
  created_at timestamptz not null default now()
);

create table if not exists user_saved (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('song','album','artist','playlist')),
  reference_id uuid not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;
alter table artists enable row level security;
alter table albums enable row level security;
alter table songs enable row level security;
alter table playlists enable row level security;
alter table genres enable row level security;
alter table artist_genres enable row level security;
alter table playlist_songs enable row level security;
alter table platform_links enable row level security;
alter table charts enable row level security;
alter table user_saved enable row level security;

-- Helper function
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Public read policies
drop policy if exists "Public read artists" on artists;
drop policy if exists "Public read albums" on albums;
drop policy if exists "Public read songs" on songs;
drop policy if exists "Public read playlists" on playlists;
drop policy if exists "Public read genres" on genres;
drop policy if exists "Public read artist_genres" on artist_genres;
drop policy if exists "Public read playlist_songs" on playlist_songs;
drop policy if exists "Public read platform_links" on platform_links;
drop policy if exists "Public read charts" on charts;

create policy "Public read artists" on artists for select using (true);
create policy "Public read albums" on albums for select using (true);
create policy "Public read songs" on songs for select using (true);
create policy "Public read playlists" on playlists for select using (true);
create policy "Public read genres" on genres for select using (true);
create policy "Public read artist_genres" on artist_genres for select using (true);
create policy "Public read playlist_songs" on playlist_songs for select using (true);
create policy "Public read platform_links" on platform_links for select using (true);
create policy "Public read charts" on charts for select using (true);

-- User saved policies
drop policy if exists "Users read own saved" on user_saved;
drop policy if exists "Users insert own saved" on user_saved;
drop policy if exists "Users delete own saved" on user_saved;

create policy "Users read own saved" on user_saved for select
  using (auth.uid() = user_id);
create policy "Users insert own saved" on user_saved for insert
  with check (auth.uid() = user_id);
create policy "Users delete own saved" on user_saved for delete
  using (auth.uid() = user_id);

-- Profile policies
drop policy if exists "Users read own profile" on profiles;
drop policy if exists "Users upsert own profile" on profiles;
drop policy if exists "Users update own profile" on profiles;

create policy "Users read own profile" on profiles for select
  using (auth.uid() = id);
create policy "Users upsert own profile" on profiles for insert
  with check (auth.uid() = id);
create policy "Users update own profile" on profiles for update
  using (auth.uid() = id);

-- Admin policies (full CRUD)
drop policy if exists "Admin manage artists" on artists;
drop policy if exists "Admin manage albums" on albums;
drop policy if exists "Admin manage songs" on songs;
drop policy if exists "Admin manage playlists" on playlists;
drop policy if exists "Admin manage genres" on genres;
drop policy if exists "Admin manage artist_genres" on artist_genres;
drop policy if exists "Admin manage playlist_songs" on playlist_songs;
drop policy if exists "Admin manage platform_links" on platform_links;
drop policy if exists "Admin manage charts" on charts;

create policy "Admin manage artists" on artists
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage albums" on albums
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage songs" on songs
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage playlists" on playlists
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage genres" on genres
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage artist_genres" on artist_genres
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage playlist_songs" on playlist_songs
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage platform_links" on platform_links
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage charts" on charts
  for all using (public.is_admin()) with check (public.is_admin());
