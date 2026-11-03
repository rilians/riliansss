-- Run in the Supabase SQL editor. Times and daily deduplication use UTC.
create table if not exists public.station_catalog (
  station_id text primary key,
  published boolean not null default true
);
create table if not exists public.station_events (
  id uuid primary key default gen_random_uuid(),
  station_id text not null references public.station_catalog(station_id),
  visitor_id uuid not null,
  event_date date not null default ((now() at time zone 'utc')::date),
  created_at timestamptz not null default now(),
  unique (station_id, visitor_id, event_date)
);
create index if not exists station_events_date_station_idx on public.station_events (event_date, station_id);
create index if not exists station_events_created_station_visitor_idx on public.station_events (created_at, station_id, visitor_id);
alter table public.station_catalog enable row level security;
alter table public.station_events enable row level security;
revoke all on public.station_catalog, public.station_events from anon, authenticated;

-- The catalog must be synced from the published station registry at deployment.
create or replace function public.record_station_exploration(p_station_id text, p_visitor_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_station_id is null or length(p_station_id) > 100 or p_visitor_id is null
     or not exists (select 1 from public.station_catalog where station_id = p_station_id and published) then
    raise exception 'Invalid station event';
  end if;
  insert into public.station_events (station_id, visitor_id)
    values (p_station_id, p_visitor_id) on conflict (station_id, visitor_id, event_date) do nothing;
end $$;
revoke all on function public.record_station_exploration(text, uuid) from public;
grant execute on function public.record_station_exploration(text, uuid) to anon, authenticated;

create or replace function public.station_analytics()
returns jsonb language sql stable security definer set search_path = '' as $$
  with counts as (
    select e.station_id,
      count(distinct e.visitor_id) filter (where e.created_at >= now() - interval '30 days') as visitors,
      count(distinct e.visitor_id) filter (where e.created_at >= now() - interval '7 days') as current_visitors,
      count(distinct e.visitor_id) filter (where e.created_at >= now() - interval '14 days' and e.created_at < now() - interval '7 days') as previous_visitors
    from public.station_events e join public.station_catalog c using (station_id)
    where c.published and e.created_at >= now() - interval '30 days' and e.created_at <= now()
    group by e.station_id
  ), popular as (
    select station_id, visitors from counts where visitors > 0 order by visitors desc, station_id limit 5
  ), trending as (
    select station_id, current_visitors, previous_visitors,
      current_visitors - previous_visitors as increase,
      case when previous_visitors = 0 then null else 100.0 * (current_visitors - previous_visitors) / previous_visitors end as growth
    from counts where current_visitors >= 5 and current_visitors > previous_visitors
    order by increase desc, growth desc nulls last, station_id limit 3
  )
  select jsonb_build_object('popular', coalesce((select jsonb_agg(to_jsonb(p)) from popular p), '[]'::jsonb),
    'trending', coalesce((select jsonb_agg(to_jsonb(t)) from trending t), '[]'::jsonb));
$$;
revoke all on function public.station_analytics() from public;
grant execute on function public.station_analytics() to anon, authenticated;
