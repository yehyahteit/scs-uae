-- ============================================================
-- SCS-UAE Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── SITE SETTINGS ─────────────────────────────────────────
create table if not exists site_settings (
  id          uuid primary key default uuid_generate_v4(),
  key         text unique not null,
  value       text,
  updated_at  timestamptz default now()
);

-- Seed default settings
insert into site_settings (key, value) values
  ('whatsapp_number', '971555953901'),
  ('live_chat_provider', 'tawk'),   -- 'tawk' | 'crisp' | 'none'
  ('tawk_property_id', ''),          -- Tawk.to Property ID
  ('crisp_website_id', ''),          -- Crisp Website ID
  ('contact_email', 'info@scs-uae.com'),
  ('contact_phone', '+971 55 595 3901'),
  ('contact_address', 'Dubai, United Arab Emirates'),
  ('facebook_url', ''),
  ('instagram_url', ''),
  ('tiktok_url', ''),
  ('linkedin_url', ''),
  ('hero_title', 'Smart Corporate Solutions'),
  ('hero_subtitle', 'Premium Uniform Supplier for All Industries in the UAE'),
  ('about_short', 'Smart Corporate Solutions F.Z.E L.L.C specializes in supplying uniforms for all industries since 2012.')
on conflict (key) do nothing;

-- ── PRODUCT CATEGORIES ────────────────────────────────────
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text unique not null,
  description text,
  image_url   text,
  sort_order  int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

insert into categories (name, slug, description, image_url, sort_order) values
  ('Restaurant & Hotel Uniform', 'restaurant', 'Jacket & Coats, Shirt, Trousers, Dress, Skirt, Neck Tie, Scarf, Belt, Shoes, and more', 'https://static.wixstatic.com/media/bf2fa2_5e5ca697bd6549b7b627dd3724857939~mv2.jpeg', 1),
  ('Medical Uniform', 'medical', 'Doctor Labcoat, Nurse Scrubs, Lab Gown, Patient''s Gown, Shoes, Name Badges, and more', 'https://static.wixstatic.com/media/bf2fa2_d6b7ceab6fcb422b9d6154a639bc4f49~mv2.jpeg', 2),
  ('Facility Management', 'facility', 'Scrubs, Shirts, Polo Shirts, Trousers, Apron, Bandana, Long Dress Types, and more', 'https://static.wixstatic.com/media/bf2fa2_9a3c13cdf5a84a4ea8eb115b441331a3~mv2.jpeg', 3),
  ('Industrial & Safety', 'safety', 'Overall, Coveralls, Jackets, Hi Visibility Wear, Suits, Cargo Trousers, Cargo Shorts, and more', 'https://static.wixstatic.com/media/bf2fa2_0ec2c06a7a964bc1a54a72ebf5e6f468~mv2.jpeg', 4),
  ('SPA & Salon', 'spa', 'Scrubsuit, Tunic Dress, Shirts, Dress, Trouser, Skirts, Name Badges, and more', 'https://static.wixstatic.com/media/bf2fa2_261cdaa2b8284d5cbc5e626ebe9f459d~mv2.jpeg', 5),
  ('Schools & Nursery', 'school', 'Shirts, Pants, Skirts, Winter Jackets, Varsity Jackets, T-Shirts, Polo Shirts, Hoodies, and more', 'https://static.wixstatic.com/media/bf2fa2_aaec700f92234f708a028eaf0e42bb18~mv2.jpeg', 6),
  ('Corporate Uniform', 'corporate', 'Jacket/Suit, Shirt, Trousers, Dress, Skirt, Neck Tie, Scarf, Belt, Shoes, and more', 'https://static.wixstatic.com/media/bf2fa2_54cf1fcd1e6f48d685021eab3fe9ee1a~mv2.jpeg', 7),
  ('Embroidery Services', 'embroidery', 'Fabrics, Hats, 3D, Flat, Patch Embroidery, Woven Patch', 'https://static.wixstatic.com/media/bf2fa2_840ef9d49a1e4da599c7ecbde2921092~mv2.jpeg', 8),
  ('Printing Services', 'printing', 'Smooth, Puff, Reflective, Glitter, Foil, Flock, Metal Vinyl, Fabrics, Hats, Metal, Ceramic, Stickers', 'https://static.wixstatic.com/media/bf2fa2_c166999b60dd42a39ca3fb2de364158d~mv2.jpeg', 9)
on conflict (slug) do nothing;

-- ── PRODUCTS ──────────────────────────────────────────────
create table if not exists products (
  id            uuid primary key default uuid_generate_v4(),
  category_id   uuid references categories(id) on delete set null,
  name          text not null,
  description   text,
  images        text[] default '{}',   -- array of image URLs
  is_featured   boolean default false,
  is_active     boolean default true,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

-- ── CLIENTS ───────────────────────────────────────────────
create table if not exists clients (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  logo_url    text,
  website_url text,
  sort_order  int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

insert into clients (name, logo_url, sort_order) values
  ('Bukhatir Group', 'https://static.wixstatic.com/media/bf2fa2_8d40aa3c52064a9a8ecd49675c7d8eb3~mv2.png', 1),
  ('Loui', 'https://static.wixstatic.com/media/bf2fa2_a88fce204e0a485f977798c975d0d67e~mv2.png', 2),
  ('Tete', 'https://static.wixstatic.com/media/bf2fa2_7798746190234d1388eb9b113482076a~mv2.jpeg', 3),
  ('Glee', 'https://static.wixstatic.com/media/bf2fa2_613332c598134e2898e7c440fc70344f~mv2.jpeg', 4),
  ('Planet Pharmacy', 'https://static.wixstatic.com/media/bf2fa2_76a94c86b33c413e9c97c23328bf9225~mv2.jpeg', 5),
  ('Finisya', 'https://static.wixstatic.com/media/bf2fa2_2235117d24a6443baa01ca5dcca47656~mv2.jpeg', 6),
  ('Osis', 'https://static.wixstatic.com/media/bf2fa2_590a822a0cfb40209c2eb0ab4fe26abb~mv2.jpeg', 7),
  ('Al Shirawi', 'https://static.wixstatic.com/media/bf2fa2_3d9388eb73d24ba5bec8d7d343e283ac~mv2.png', 8),
  ('Morsel', 'https://static.wixstatic.com/media/bf2fa2_ca1cc67a02994b39b63a8b44303e0e46~mv2.jpeg', 9),
  ('Parlour', 'https://static.wixstatic.com/media/bf2fa2_ed7493e5b0c54919bc410e6038c0a69d~mv2.png', 10)
on conflict do nothing;

-- ── TESTIMONIALS ──────────────────────────────────────────
create table if not exists testimonials (
  id          uuid primary key default uuid_generate_v4(),
  author_name text not null,
  author_role text,
  company     text,
  content     text not null,
  rating      int default 5 check (rating between 1 and 5),
  avatar_url  text,
  is_active   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

insert into testimonials (author_name, author_role, company, content, rating, sort_order) values
  ('Amanda Johns', 'COO', '', 'It''s always a pleasure to work with SCS and their team. They are personable, responsive, and results-oriented!', 5, 1)
on conflict do nothing;

-- ── CONTACT MESSAGES ──────────────────────────────────────
create table if not exists contact_messages (
  id          uuid primary key default uuid_generate_v4(),
  type        text default 'contact' check (type in ('contact', 'quote')),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,
  message     text not null,
  category    text,   -- for quote requests: which product category
  quantity    text,   -- for quote requests
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- ── GALLERY / HERO IMAGES ─────────────────────────────────
create table if not exists gallery_images (
  id          uuid primary key default uuid_generate_v4(),
  url         text not null,
  alt_text    text,
  section     text default 'hero',  -- 'hero' | 'about' | 'services'
  sort_order  int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

insert into gallery_images (url, alt_text, section, sort_order) values
  ('https://static.wixstatic.com/media/bf2fa2_c2bbf84b937d4f04be53381926ed90a0~mv2.jpeg', 'SCS Uniforms', 'hero', 1),
  ('https://static.wixstatic.com/media/bf2fa2_5e5ca697bd6549b7b627dd3724857939~mv2.jpeg', 'Hotel Uniforms', 'hero', 2),
  ('https://static.wixstatic.com/media/bf2fa2_9a3c13cdf5a84a4ea8eb115b441331a3~mv2.jpeg', 'Cleaning Uniforms', 'hero', 3),
  ('https://static.wixstatic.com/media/bf2fa2_d6b7ceab6fcb422b9d6154a639bc4f49~mv2.jpeg', 'Medical Uniforms', 'hero', 4),
  ('https://static.wixstatic.com/media/bf2fa2_261cdaa2b8284d5cbc5e626ebe9f459d~mv2.jpeg', 'Salon Uniforms', 'hero', 5),
  ('https://static.wixstatic.com/media/bf2fa2_ea3e8a6af56b4d3e89a87fd4490d9ecc~mv2.jpeg', 'Safety Uniforms', 'hero', 6),
  ('https://static.wixstatic.com/media/bf2fa2_aaec700f92234f708a028eaf0e42bb18~mv2.jpeg', 'School Uniforms', 'hero', 7),
  ('https://static.wixstatic.com/media/bf2fa2_0ec2c06a7a964bc1a54a72ebf5e6f468~mv2.jpeg', 'Industrial Uniforms', 'hero', 8),
  ('https://static.wixstatic.com/media/bf2fa2_54cf1fcd1e6f48d685021eab3fe9ee1a~mv2.jpeg', 'Corporate Uniforms', 'hero', 9),
  ('https://static.wixstatic.com/media/bf2fa2_840ef9d49a1e4da599c7ecbde2921092~mv2.jpeg', 'Embroidery', 'hero', 10),
  ('https://static.wixstatic.com/media/bf2fa2_c166999b60dd42a39ca3fb2de364158d~mv2.jpeg', 'Printing Services', 'hero', 11)
on conflict do nothing;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- site_settings: public read, authenticated write
alter table site_settings enable row level security;
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Auth write site_settings" on site_settings for all using (auth.role() = 'authenticated');

-- categories: public read, authenticated write
alter table categories enable row level security;
create policy "Public read categories" on categories for select using (is_active = true);
create policy "Auth all categories" on categories for all using (auth.role() = 'authenticated');

-- products: public read active, authenticated all
alter table products enable row level security;
create policy "Public read products" on products for select using (is_active = true);
create policy "Auth all products" on products for all using (auth.role() = 'authenticated');

-- clients: public read active
alter table clients enable row level security;
create policy "Public read clients" on clients for select using (is_active = true);
create policy "Auth all clients" on clients for all using (auth.role() = 'authenticated');

-- testimonials: public read active
alter table testimonials enable row level security;
create policy "Public read testimonials" on testimonials for select using (is_active = true);
create policy "Auth all testimonials" on testimonials for all using (auth.role() = 'authenticated');

-- contact_messages: public insert, authenticated read
alter table contact_messages enable row level security;
create policy "Public insert messages" on contact_messages for insert with check (true);
create policy "Auth read messages" on contact_messages for select using (auth.role() = 'authenticated');
create policy "Auth update messages" on contact_messages for update using (auth.role() = 'authenticated');

-- gallery_images: public read active
alter table gallery_images enable row level security;
create policy "Public read gallery" on gallery_images for select using (is_active = true);
create policy "Auth all gallery" on gallery_images for all using (auth.role() = 'authenticated');


-- ============================================================
-- STORAGE BUCKETS
-- (Run after creating storage in Supabase dashboard)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
-- insert into storage.buckets (id, name, public) values ('clients', 'clients', true);
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);
--
-- create policy "Public read products bucket" on storage.objects for select using (bucket_id = 'products');
-- create policy "Auth upload products" on storage.objects for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');
-- create policy "Auth delete products" on storage.objects for delete using (bucket_id = 'products' and auth.role() = 'authenticated');
