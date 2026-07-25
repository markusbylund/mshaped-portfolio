create table if not exists public.playdate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  parent_name text not null,
  active_child_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.playdate_children (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age int not null check (age between 0 and 18),
  school text not null default 'Skola ej angiven',
  interests text[] not null default '{}',
  avatar text not null,
  color text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.playdate_availability_slots (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  child_ids text[] not null default '{}',
  state text not null default 'ledig' check (state in ('ledig')),
  created_at timestamptz not null default now(),
  check (start_time < end_time)
);

alter table public.playdate_profiles enable row level security;
alter table public.playdate_children enable row level security;
alter table public.playdate_availability_slots enable row level security;

drop policy if exists "Users can manage their own playdate profile" on public.playdate_profiles;
drop policy if exists "Users can manage their own children" on public.playdate_children;
drop policy if exists "Users can manage their own availability" on public.playdate_availability_slots;

create policy "Users can manage their own playdate profile"
on public.playdate_profiles
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own children"
on public.playdate_children
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own availability"
on public.playdate_availability_slots
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists playdate_children_user_id_idx
on public.playdate_children(user_id);

create index if not exists playdate_availability_slots_user_id_date_idx
on public.playdate_availability_slots(user_id, date, start_time);
