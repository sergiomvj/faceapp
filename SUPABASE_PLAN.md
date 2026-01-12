
# ⚡ Facebrasil App - Plano de Migração Supabase

Este documento guia a migração do estado local para o **Supabase Backend-as-a-Service**.

## 1. Configuração SQL (Dashboard Supabase)

Execute estes comandos no SQL Editor do Supabase para preparar o banco:

```sql
-- Perfil de Usuário
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  level text default 'Bronze',
  points integer default 200,
  facetas integer default 5,
  articles_read text[] default '{}',
  last_check_in date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gestão de Anúncios (Ads)
create table public.advertisements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  client_name text,
  image_url text not null,
  target_url text,
  position text, -- e.g., 'home_top', 'article_sidebar'
  is_active boolean default true,
  views_count integer default 0,
  clicks_count integer default 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Acesso de Criadores Externos (External Article Creators)
create table public.external_api_keys (
  id uuid default gen_random_uuid() primary key,
  creator_name text not null,
  api_key uuid default gen_random_uuid() not null unique,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Gestão de Newsletter
create table public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  full_name text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Artigos Principal
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  content text,
  category text,
  author text,
  reading_time text,
  image_url text,
  is_featured boolean default false,
  city text,
  created_at timestamp with time zone default now()
);

-- Revistas (Banca Digital)
create table public.magazines (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  month text,
  year text,
  image_url text,
  cover_url text,
  pdf_url text,
  created_at timestamp with time zone default now()
);

-- Eventos da Comunidade
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date,
  time text,
  location text,
  organizer text,
  category text,
  created_at timestamp with time zone default now()
);

-- Sugestão de Pautas (Hot Topics)
create table public.article_suggestions (
  id uuid default gen_random_uuid() primary key,
  topic text not null,
  source_api text, -- e.g., 'Google Trends', 'Twitter'
  score decimal, -- trending score
  status text default 'pending', -- pending, approved, writing, published
  created_at timestamp with time zone default now()
);

-- Sempre Alerta (Community Reports)
create table public.community_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  content text not null,
  type text check (type in ('video', 'image', 'text')),
  location text,
  media_url text,
  status text default 'pending', -- pending, verified, rejected, breaking
  created_at timestamp with time zone default now()
);

-- BrVIP (Celebrities)
create table public.celebrity_stories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  image_url text not null,
  content text not null,
  excerpt text,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);

-- Habilitar Row Level Security
alter table public.profiles enable row level security;
alter table public.advertisements enable row level security;
alter table public.external_api_keys enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.article_suggestions enable row level security;
alter table public.community_reports enable row level security;
alter table public.celebrity_stories enable row level security;
alter table public.articles enable row level security;
alter table public.magazines enable row level security;
alter table public.events enable row level security;

-- Políticas de Acesso Simplificadas (Admin Only for management tables)
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Anyone can view active ads." on public.advertisements for select using (is_active = true);
create policy "Admins can manage ads." on public.advertisements using (auth.jwt() ->> 'role' = 'admin');

create policy "Admins can manage external keys." on public.external_api_keys using (auth.jwt() ->> 'role' = 'admin');

create policy "Anyone can subscribe to newsletter." on public.newsletter_subscribers for insert with check (true);
create policy "Admins can manage newsletter." on public.newsletter_subscribers using (auth.jwt() ->> 'role' = 'admin');

create policy "Reports are viewable by everyone." on public.community_reports for select using (true);
create policy "Users can submit reports." on public.community_reports for insert with check (auth.uid() = user_id);

create policy "Stories are viewable by everyone." on public.celebrity_stories for select using (true);
create policy "Admins can manage stories." on public.celebrity_stories using (auth.jwt() ->> 'role' = 'admin');

create policy "Articles are viewable by everyone." on public.articles for select using (true);
create policy "Admins can manage articles." on public.articles using (auth.jwt() ->> 'role' = 'admin');

create policy "Magazines are viewable by everyone." on public.magazines for select using (true);
create policy "Admins can manage magazines." on public.magazines using (auth.jwt() ->> 'role' = 'admin');

create policy "Events are viewable by everyone." on public.events for select using (true);
create policy "Admins can manage events." on public.events using (auth.jwt() ->> 'role' = 'admin');
```

## 2. Implementação no Frontend (Novos Módulos)

1.  **Gestão de Anúncios**: Componente para upload e monitoramento de banners na Home e Artigos.
2.  **External Creator API**: Interface para gerenciar tokens de acesso para sistemas de IA ou criadores externos postarem via portal.
3.  **Newsletter Center**: Captura de leads e monitoramento da base de inscritos.
4.  **Assuntos Quentes (Agenda Creator)**: Dashboard que consome APIs de tendências para sugerir pautas ao time editorial.
5.  **Refatoração MVP**: Migração de lógica embutida no `App.tsx` para componentes de arquivo único.

## 3. Estrutura de Pastas Preparada

- `/context/AuthContext.tsx`: Gerencia o estado de login e listener do Supabase.
- `/services/supabaseClient.ts`: Instância do cliente Supabase.
- `/utils`: Utilitários para limpeza de código.
- `/components/Loading.tsx`: Feedbacks visuais premium para estados assíncronos.
```
