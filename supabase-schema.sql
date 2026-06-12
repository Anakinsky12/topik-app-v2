-- TOPIK App v2 — Supabase SQL Editor'da ishga tushiring

-- 1. Profil jadvali
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  target_level int default 5,
  exam_date date,
  daily_words int default 20,
  updated_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- 2. So'z progressi (cloud sync)
create table if not exists word_progress (
  user_id uuid references auth.users on delete cascade,
  word_id int not null,
  status text default 'unknown', -- known | unknown | review
  srs_level int default 0,
  next_review timestamptz,
  updated_at timestamptz default now(),
  primary key (user_id, word_id)
);
alter table word_progress enable row level security;
create policy "own progress" on word_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. Statistika / aktivlik
create table if not exists daily_activity (
  user_id uuid references auth.users on delete cascade,
  day date not null,
  xp int default 0,
  words_learned int default 0,
  tasks_done int default 0,
  primary key (user_id, day)
);
alter table daily_activity enable row level security;
create policy "own activity" on daily_activity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. Mock test tarixi
create table if not exists test_history (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade,
  score int,
  total int,
  taken_at timestamptz default now()
);
alter table test_history enable row level security;
create policy "own tests" on test_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
