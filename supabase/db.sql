-- Create tasks table, linking each task to the logged-in user
create table public.tasks (
                              id bigserial primary key,
                              user_id uuid not null references auth.users(id) on delete cascade,
                              text text not null,
                              color text not null,
                              due_date timestamptz not null,
                              completed boolean not null default false,
                              inserted_at timestamptz not null default now(),
                              updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- Policy: users can read their own tasks
create policy "Select own tasks"
  on public.tasks
  for select
                 using ( auth.uid() = user_id );

-- Policy: users can insert their own tasks
create policy "Insert own tasks"
  on public.tasks
  for insert
  with check ( auth.uid() = user_id );

-- Policy: users can update or delete only their own tasks
create policy "Modify own tasks"
  on public.tasks
  for update using ( auth.uid() = user_id )
      with check ( auth.uid() = user_id );
create policy "Delete own tasks"
  on public.tasks
  for delete using ( auth.uid() = user_id );
