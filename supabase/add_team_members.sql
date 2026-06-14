-- ── TEAM MEMBERS ──────────────────────────────────────────────
create table if not exists team_members (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  role        text not null,
  bio         text,
  photo_url   text,
  email       text,
  whatsapp    text,
  linkedin_url text,
  sort_order  int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- Seed Hussein Ibrahim
insert into team_members (name, role, bio, whatsapp, email, sort_order) values (
  'Hussein Ibrahim',
  'General Manager',
  'Hussein Ibrahim is an essential part of the team, and has been with Smart Corporate Solutions since the very beginning. As our General Manager, he has ensured that countless clients receive exactly what they need and are completely satisfied.',
  '971555953901',
  'info@scs-uae.com',
  1
) on conflict do nothing;

-- RLS
alter table team_members enable row level security;
create policy "Public read team_members" on team_members for select using (is_active = true);
create policy "Auth all team_members" on team_members for all using (auth.role() = 'authenticated');
