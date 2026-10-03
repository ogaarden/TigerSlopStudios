-- Gravitube: global toppliste
-- Lim inn alt dette i Supabase: SQL Editor -> New query -> Run.
-- Kan kjøres flere ganger uten å ødelegge noe.

create extension if not exists pgcrypto with schema extensions;

-- Spillere. Hemmeligheten ligger bare her, og tabellen kan ikke leses av besøkende.
create table if not exists public.gravitube_players (
  id          uuid primary key,
  secret_hash text not null,
  nick        text not null,
  created_at  timestamptz not null default now()
);

-- Beste resultat per spiller og bane. Alle kan lese denne.
-- Flat og Bumpy: m = distanse i meter (høyest vinner).
-- Sprint: m = tid i hundredels sekunder (lavest vinner).
create table if not exists public.gravitube_scores (
  player_id uuid not null references public.gravitube_players(id) on delete cascade,
  map       text not null check (map in ('flat', 'bumpy', 'sprint')),
  nick      text not null,
  m         integer not null check (m >= 0 and m <= 1000000),
  t         real,
  at        timestamptz not null default now(),
  primary key (player_id, map)
);
create index if not exists gravitube_scores_rank on public.gravitube_scores (map, m desc, at);

-- Oppgradering av eldre oppsett: tillat Sprint-banen.
alter table public.gravitube_scores drop constraint if exists gravitube_scores_map_check;
alter table public.gravitube_scores add constraint gravitube_scores_map_check check (map in ('flat', 'bumpy', 'sprint'));

alter table public.gravitube_players enable row level security;
alter table public.gravitube_scores  enable row level security;

do $do$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'gravitube_scores' and policyname = 'Alle kan lese topplisten') then
    create policy "Alle kan lese topplisten" on public.gravitube_scores for select using (true);
  end if;
end $do$;
-- Ingen andre policyer: all skriving går gjennom funksjonen under.

-- Legger inn et resultat (bare hvis det er bedre enn før) og/eller oppdaterer kallenavnet.
-- p_map = null betyr «bare bytt kallenavn».
create or replace function public.gravitube_submit(
  p_id uuid, p_secret text, p_map text, p_nick text, p_m integer, p_t real
) returns integer
language plpgsql security definer
set search_path = public, extensions
as $$
declare
  h    text;
  v_nick text := left(btrim(regexp_replace(coalesce(p_nick, ''), '[[:cntrl:]]', '', 'g')), 16);
  best integer;
begin
  if p_id is null or char_length(coalesce(p_secret, '')) < 32 then
    raise exception 'invalid player';
  end if;
  if v_nick = '' then v_nick := 'Player'; end if;

  h := (select secret_hash from gravitube_players where id = p_id);
  if h is null then
    insert into gravitube_players (id, secret_hash, nick) values (p_id, crypt(p_secret, gen_salt('bf')), v_nick);
  elsif h <> crypt(p_secret, h) then
    raise exception 'forbidden';
  else
    update gravitube_players set nick = v_nick where id = p_id;
    update gravitube_scores  set nick = v_nick where player_id = p_id;
  end if;

  if p_map is null then return 0; end if;
  if p_m is null or p_m < 0 or p_m > 1000000 then raise exception 'invalid score'; end if;

  insert into gravitube_scores (player_id, map, nick, m, t)
  values (p_id, p_map, v_nick, p_m, p_t)
  on conflict (player_id, map) do update
    set m = excluded.m, t = excluded.t, nick = excluded.nick, at = now()
    where case when excluded.map = 'sprint' then excluded.m < gravitube_scores.m
               else excluded.m > gravitube_scores.m end;

  best := (select s.m from gravitube_scores s where s.player_id = p_id and s.map = p_map);
  return coalesce(best, 0);
end;
$$;

-- Nye Supabase-prosjekter gir ikke alltid anon tilgang automatisk.
grant usage on schema public to anon, authenticated;
grant select on public.gravitube_scores to anon, authenticated;
revoke all on public.gravitube_players from anon, authenticated;

revoke all on function public.gravitube_submit(uuid, text, text, text, integer, real) from public;
grant execute on function public.gravitube_submit(uuid, text, text, text, integer, real) to anon, authenticated;
