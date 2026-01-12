
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

-- Habilitar Row Level Security
alter table public.profiles enable row level security;

-- Políticas de Acesso
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);
```

## 2. Implementação no Frontend (Amanhã)

1.  **Migrar Dados Fixos**: Mover `ARTICLES` de `constants.ts` para a tabela `articles`.
2.  **Auth UI**: Criar modal de Sign In com Google/Email na página de Perfil.
3.  **Realtime Check-in**: Substituir o `localStorage` do check-in por um update na tabela `profiles`.
4.  **BalcãoUSA CRUD**: Implementar o `insert` de novos anúncios.

## 3. Estrutura de Pastas Preparada

- `/context/AuthContext.tsx`: Gerencia o estado de login e listener do Supabase.
- `/services/supabaseClient.ts`: Instância do cliente Supabase.
- `/utils`: Utilitários para limpeza de código.
- `/components/Loading.tsx`: Feedbacks visuais premium para estados assíncronos.
```
