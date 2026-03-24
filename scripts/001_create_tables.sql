-- CareerCompass Database Schema
-- Student profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  age integer,
  education_level text, -- 'high_school', 'undergraduate', 'graduate', 'professional'
  current_grade text,
  interests text[],
  skills text[],
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Psychometric test results
create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_type text not null, -- 'personality', 'aptitude', 'interest', 'learning_style'
  scores jsonb not null, -- Store dimension scores
  career_matches jsonb, -- Matched careers based on results
  completed_at timestamp with time zone default now()
);

-- Career interests and bookmarks
create table if not exists public.career_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  career_id text not null,
  career_name text not null,
  match_score integer, -- 0-100
  is_bookmarked boolean default false,
  notes text,
  created_at timestamp with time zone default now()
);

-- Learning milestones and progress
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text, -- 'education', 'skill', 'certification', 'experience'
  target_date date,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Chat history for AI advisor
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  messages jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.assessment_results enable row level security;
alter table public.career_interests enable row level security;
alter table public.milestones enable row level security;
alter table public.chat_sessions enable row level security;

-- RLS Policies for profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- RLS Policies for assessment_results
create policy "assessment_select_own" on public.assessment_results for select using (auth.uid() = user_id);
create policy "assessment_insert_own" on public.assessment_results for insert with check (auth.uid() = user_id);
create policy "assessment_update_own" on public.assessment_results for update using (auth.uid() = user_id);
create policy "assessment_delete_own" on public.assessment_results for delete using (auth.uid() = user_id);

-- RLS Policies for career_interests
create policy "careers_select_own" on public.career_interests for select using (auth.uid() = user_id);
create policy "careers_insert_own" on public.career_interests for insert with check (auth.uid() = user_id);
create policy "careers_update_own" on public.career_interests for update using (auth.uid() = user_id);
create policy "careers_delete_own" on public.career_interests for delete using (auth.uid() = user_id);

-- RLS Policies for milestones
create policy "milestones_select_own" on public.milestones for select using (auth.uid() = user_id);
create policy "milestones_insert_own" on public.milestones for insert with check (auth.uid() = user_id);
create policy "milestones_update_own" on public.milestones for update using (auth.uid() = user_id);
create policy "milestones_delete_own" on public.milestones for delete using (auth.uid() = user_id);

-- RLS Policies for chat_sessions
create policy "chats_select_own" on public.chat_sessions for select using (auth.uid() = user_id);
create policy "chats_insert_own" on public.chat_sessions for insert with check (auth.uid() = user_id);
create policy "chats_update_own" on public.chat_sessions for update using (auth.uid() = user_id);
create policy "chats_delete_own" on public.chat_sessions for delete using (auth.uid() = user_id);
