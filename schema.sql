-- Run these commands in the Supabase SQL Editor

-- Create the profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  avatar_url text,
  calorie_goal integer default 2000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile." on profiles for select using (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create the meals table
create table public.meals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  food_id text not null,
  food_name text not null,
  meal_type text not null, -- 'Breakfast', 'Lunch', 'Snack', 'Dinner'
  quantity numeric not null,
  unit text not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  logged_date date default CURRENT_DATE not null
);

-- Enable RLS on meals
alter table public.meals enable row level security;
create policy "Users can manage their own meals." on meals for all using (auth.uid() = user_id);
