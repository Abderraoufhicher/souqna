-- SOUQNA platform upgrade
-- Run AFTER the existing schema.sq1 in Supabase SQL Editor.
create extension if not exists pgcrypto;

alter table public.profiles add column if not exists municipality text;
alter table public.profiles add column if not exists avatar_path text;
alter table public.stores add column if not exists latitude double precision;
alter table public.stores add column if not exists longitude double precision;
alter table public.stores add column if not exists opening_hours jsonb not null default '{}'::jsonb;
alter table public.stores add column if not exists is_open_override boolean;
alter table public.stores add column if not exists response_rate numeric(5,2) not null default 0;
alter table public.stores add column if not exists completed_orders integer not null default 0;
alter table public.products add column if not exists condition text not null default 'new'
  check (condition in ('new','used','refurbished'));
alter table public.products add column if not exists video_path text;
alter table public.products add column if not exists compare_at_price numeric(14,2);
alter table public.products add column if not exists minimum_order integer not null default 1;
alter table public.products add column if not exists updated_at timestamptz not null default now();

create table if not exists public.store_branches (
 id uuid primary key default gen_random_uuid(),
 store_id uuid not null references public.stores(id) on delete cascade,
 name text not null, wilaya text not null, municipality text, address text,
 latitude double precision, longitude double precision, phone text,
 opening_hours jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create table if not exists public.negotiation_offers (
 id uuid primary key default gen_random_uuid(),
 product_id uuid not null references public.products(id) on delete cascade,
 store_id uuid not null references public.stores(id) on delete cascade,
 buyer_id uuid not null references public.profiles(id) on delete cascade,
 quantity integer not null default 1 check(quantity > 0),
 listed_price numeric(14,2) not null,
 offered_price numeric(14,2) not null check(offered_price >= 0),
 counter_price numeric(14,2),
 status text not null default 'pending'
  check(status in ('pending','countered','accepted','rejected','expired','withdrawn')),
 buyer_note text, seller_note text,
 expires_at timestamptz not null default now()+interval '48 hours',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists negotiation_store_status_idx
 on public.negotiation_offers(store_id,status,created_at desc);
create index if not exists negotiation_buyer_idx
 on public.negotiation_offers(buyer_id,created_at desc);

create table if not exists public.store_stories (
 id uuid primary key default gen_random_uuid(),
 store_id uuid not null references public.stores(id) on delete cascade,
 media_path text not null, media_type text not null check(media_type in ('image','video')),
 caption text, expires_at timestamptz not null default now()+interval '24 hours',
 created_at timestamptz not null default now()
);
create index if not exists store_stories_expiry_idx on public.store_stories(expires_at);
create table if not exists public.story_views (
 story_id uuid not null references public.store_stories(id) on delete cascade,
 viewer_id uuid not null references public.profiles(id) on delete cascade,
 viewed_at timestamptz not null default now(), primary key(story_id,viewer_id)
);

create table if not exists public.market_orders (
 id uuid primary key default gen_random_uuid(),
 buyer_id uuid not null references public.profiles(id) on delete restrict,
 store_id uuid not null references public.stores(id) on delete restrict,
 status text not null default 'pending'
  check(status in ('pending','confirmed','preparing','shipped','delivered','cancelled')),
 payment_method text not null default 'cash_on_delivery'
  check(payment_method in ('cash_on_delivery','manual_baridimob')),
 subtotal numeric(14,2) not null check(subtotal>=0),
 delivery_fee numeric(14,2) not null default 0 check(delivery_fee>=0),
 total numeric(14,2) generated always as (subtotal+delivery_fee) stored,
 delivery_address text not null, buyer_phone text not null,
 tracking_code text unique, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.market_order_items (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references public.market_orders(id) on delete cascade,
 product_id uuid references public.products(id) on delete set null,
 product_name text not null, unit_price numeric(14,2) not null,
 quantity integer not null check(quantity>0),
 line_total numeric(14,2) generated always as (unit_price*quantity) stored
);

create table if not exists public.price_alerts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete cascade,
 target_price numeric(14,2) not null, is_active boolean not null default true,
 created_at timestamptz not null default now(), unique(user_id,product_id)
);
create table if not exists public.store_coupons (
 id uuid primary key default gen_random_uuid(),
 store_id uuid not null references public.stores(id) on delete cascade,
 code text not null, discount_type text not null check(discount_type in ('percent','fixed')),
 discount_value numeric(14,2) not null, starts_at timestamptz not null default now(),
 ends_at timestamptz, usage_limit integer, used_count integer not null default 0,
 active boolean not null default true, created_at timestamptz not null default now(),
 unique(store_id,code)
);
create table if not exists public.platform_reports (
 id uuid primary key default gen_random_uuid(),
 reporter_id uuid not null references public.profiles(id) on delete cascade,
 target_type text not null check(target_type in ('store','product','user','review','message')),
 target_id uuid not null, reason text not null, details text,
 status text not null default 'open' check(status in ('open','reviewing','resolved','dismissed')),
 created_at timestamptz not null default now()
);
create table if not exists public.user_notifications (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 title text not null, body text not null, href text, read_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.followed_searches (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 query text not null, category text, wilaya text, created_at timestamptz not null default now()
);

alter table public.reviews add column if not exists order_id uuid
 references public.market_orders(id) on delete set null;
alter table public.reviews add column if not exists verified_purchase boolean not null default false;
alter table public.reviews add column if not exists media_path text;

do $$ declare t text; begin
 foreach t in array array[
 'store_branches','negotiation_offers','store_stories','story_views','market_orders',
 'market_order_items','price_alerts','store_coupons','platform_reports',
 'user_notifications','followed_searches'
 ] loop execute format('alter table public.%I enable row level security',t); end loop;
end $$;

drop policy if exists "branches public read" on public.store_branches;
create policy "branches public read" on public.store_branches for select using (true);
drop policy if exists "branches owner manage" on public.store_branches;
create policy "branches owner manage" on public.store_branches for all
 using (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()))
 with check (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()));

drop policy if exists "negotiation participants read" on public.negotiation_offers;
create policy "negotiation participants read" on public.negotiation_offers for select
 using (buyer_id=auth.uid() or exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()));
drop policy if exists "buyer creates offer" on public.negotiation_offers;
create policy "buyer creates offer" on public.negotiation_offers for insert
 with check (buyer_id=auth.uid() and exists(
  select 1 from public.products p where p.id=product_id and p.store_id=store_id and p.status='active'));
drop policy if exists "seller responds offer" on public.negotiation_offers;
create policy "seller responds offer" on public.negotiation_offers for update
 using (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()))
 with check (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()));

drop policy if exists "active stories public read" on public.store_stories;
create policy "active stories public read" on public.store_stories for select using (expires_at>now());
drop policy if exists "store owner manages stories" on public.store_stories;
create policy "store owner manages stories" on public.store_stories for all
 using (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()))
 with check (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()));
drop policy if exists "story viewer records own view" on public.story_views;
create policy "story viewer records own view" on public.story_views for all
 using (viewer_id=auth.uid()) with check (viewer_id=auth.uid());

drop policy if exists "buyer and seller read orders" on public.market_orders;
create policy "buyer and seller read orders" on public.market_orders for select
 using (buyer_id=auth.uid() or exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()));
drop policy if exists "buyer creates order" on public.market_orders;
create policy "buyer creates order" on public.market_orders for insert with check (buyer_id=auth.uid());
drop policy if exists "seller updates order" on public.market_orders;
create policy "seller updates order" on public.market_orders for update
 using (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()))
 with check (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()));
drop policy if exists "order participants read items" on public.market_order_items;
create policy "order participants read items" on public.market_order_items for select
 using (exists(select 1 from public.market_orders o left join public.stores s on s.id=o.store_id
 where o.id=order_id and (o.buyer_id=auth.uid() or s.owner_id=auth.uid())));
drop policy if exists "buyer inserts order items" on public.market_order_items;
create policy "buyer inserts order items" on public.market_order_items for insert
 with check (exists(select 1 from public.market_orders o where o.id=order_id and o.buyer_id=auth.uid()));

drop policy if exists "price alerts owner all" on public.price_alerts;
create policy "price alerts owner all" on public.price_alerts for all
 using (user_id=auth.uid()) with check (user_id=auth.uid());
drop policy if exists "coupon public read active" on public.store_coupons;
create policy "coupon public read active" on public.store_coupons for select
 using (active and (ends_at is null or ends_at>now()));
drop policy if exists "coupon store owner manage" on public.store_coupons;
create policy "coupon store owner manage" on public.store_coupons for all
 using (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()))
 with check (exists(select 1 from public.stores s where s.id=store_id and s.owner_id=auth.uid()));

drop policy if exists "reporter creates own report" on public.platform_reports;
create policy "reporter creates own report" on public.platform_reports for insert with check (reporter_id=auth.uid());
drop policy if exists "reporter reads own reports" on public.platform_reports;
create policy "reporter reads own reports" on public.platform_reports for select using (reporter_id=auth.uid());
drop policy if exists "notification owner read update" on public.user_notifications;
create policy "notification owner read update" on public.user_notifications for all
 using (user_id=auth.uid()) with check (user_id=auth.uid());
drop policy if exists "followed search owner all" on public.followed_searches;
create policy "followed search owner all" on public.followed_searches for all
 using (user_id=auth.uid()) with check (user_id=auth.uid());

create index if not exists product_events_created_idx on public.product_events(created_at desc);
create index if not exists products_category_wilaya_idx on public.products(category,wilaya,status);
create index if not exists stores_geo_idx on public.stores(latitude,longitude);
create index if not exists stores_wilaya_municipality_idx on public.stores(wilaya,municipality);
create index if not exists notifications_unread_idx on public.user_notifications(user_id,created_at desc) where read_at is null;

create or replace view public.store_trust_summary with (security_invoker=true) as
select s.id as store_id,
 coalesce(avg(r.rating),0)::numeric(3,2) as average_rating,
 count(r.id)::integer as review_count, s.completed_orders, s.response_rate,
 (coalesce(avg(r.rating),0)*12 + least(s.completed_orders,100)*0.25
  + least(s.response_rate,100)*0.08)::numeric(5,2) as trust_score
from public.stores s left join public.reviews r on r.store_id=s.id
group by s.id,s.completed_orders,s.response_rate;

-- Create Supabase Storage buckets store-assets and product-images in Dashboard.
-- Configure bucket policies separately; never put service_role in browser code.
-- Schedule deletion of expired stories with Supabase Cron:
-- delete from public.store_stories where expires_at <= now();
