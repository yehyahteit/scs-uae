# SCS UAE — Next.js Website

Modern rebuild of scs-uae.com using Next.js 14, Tailwind CSS, Supabase, and Vercel.

---

## Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase Postgres |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |
| Forms | React Hook Form + Zod |

---

## Folder Structure

```
scs-nextjs/
├── src/
│   ├── app/
│   │   ├── (public)/           # Public website (Navbar + Footer layout)
│   │   │   ├── page.tsx        # Home
│   │   │   ├── about/
│   │   │   ├── products/
│   │   │   │   └── [slug]/     # Dynamic category pages
│   │   │   ├── services/
│   │   │   └── contact/
│   │   ├── admin/              # Admin CMS (auth protected)
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── clients/
│   │   │   ├── testimonials/
│   │   │   ├── messages/
│   │   │   ├── gallery/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── contact/        # POST contact message
│   │   │   └── quote/          # POST quote request
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, WhatsAppButton, LiveChat
│   │   ├── ui/                 # ContactForm, QuoteForm
│   │   └── admin/              # AdminSidebar
│   ├── lib/
│   │   ├── supabase.ts         # Supabase clients
│   │   └── utils.ts
│   ├── types/
│   │   └── database.ts         # TypeScript types for all tables
│   └── middleware.ts            # Auth protection for /admin
├── supabase/
│   └── schema.sql              # Full DB schema + seed data + RLS
├── public/
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 1. Supabase Setup

### Create Project
1. Go to https://supabase.com and create a new project
2. Choose a region (e.g. `eu-central-1` for UAE proximity)
3. Note your **Project URL** and **anon key** and **service_role key**

### Run Schema
1. Open **Supabase Dashboard → SQL Editor**
2. Paste the full contents of `supabase/schema.sql`
3. Click **Run** — this creates all tables, seeds initial data, and sets RLS policies

### Create Storage Buckets
In **Supabase Dashboard → Storage**, create these buckets (all **Public**):
- `products`
- `clients`
- `gallery`

Then add storage policies (paste into SQL Editor):
```sql
insert into storage.buckets (id, name, public) values ('products', 'products', true);
insert into storage.buckets (id, name, public) values ('clients', 'clients', true);
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);

create policy "Public read products bucket" on storage.objects for select using (bucket_id = 'products');
create policy "Auth upload products" on storage.objects for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "Auth delete products" on storage.objects for delete using (bucket_id = 'products' and auth.role() = 'authenticated');

-- Repeat same 3 policies for 'clients' and 'gallery' buckets
```

### Create Admin User
In **Supabase Dashboard → Authentication → Users**, click **Add User** and create:
- Email: `info@scs-uae.com` (or any admin email)
- Password: (strong password)

---

## 2. Local Development

```bash
# Clone / navigate to project
cd scs-nextjs

# Install dependencies
npm install

# Copy env file and fill in your Supabase credentials
cp .env.local.example .env.local
# Edit .env.local with your actual values

# Run dev server
npm run dev
# → http://localhost:3000
```

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 3. Deploy to Vercel

### One-click Deploy
1. Push this project to a GitHub repository
2. Go to https://vercel.com/new and import the repo
3. Set **Framework Preset** to `Next.js`
4. Add all environment variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://www.scs-uae.com`
5. Click **Deploy**

### Domain Migration (scs-uae.com → Vercel)
1. In **Vercel → Project → Settings → Domains**, add `www.scs-uae.com` and `scs-uae.com`
2. Vercel will show you DNS records to set
3. Log in to your domain registrar (the one holding scs-uae.com)
4. Update DNS:
   - `A` record for `@` → `76.76.19.61` (Vercel IP)
   - `CNAME` for `www` → `cname.vercel-dns.com`
5. Propagation takes 1–48 hours
6. Wix can be left live until DNS propagates, then it will automatically redirect to the new site

---

## 4. Admin CMS Usage

Navigate to `https://www.scs-uae.com/admin` and sign in with the credentials you created in Supabase Auth.

| Page | What you can manage |
|------|---------------------|
| Dashboard | Overview counts and quick actions |
| Products | Add/edit/delete products with images |
| Categories | Manage product categories and slugs |
| Clients | Client logos shown on homepage |
| Testimonials | Customer reviews |
| Messages | View contact form and quote submissions |
| Gallery | Hero slideshow images |
| Settings | WhatsApp number, live chat, social links |

---

## 5. Live Chat Setup

### Tawk.to (Free)
1. Sign up at https://www.tawk.to
2. Create a property → copy your **Property ID** (format: `xxxxxxxx/default`)
3. In Admin → Settings, set:
   - `Live Chat Provider` = `tawk`
   - `Tawk.to Property ID` = your property ID

### Crisp (Free tier)
1. Sign up at https://crisp.chat
2. Create a website → copy **Website ID**
3. In Admin → Settings, set:
   - `Live Chat Provider` = `crisp`
   - `Crisp Website ID` = your website ID

---

## 6. SEO Features

- ✅ `next/metadata` for all pages
- ✅ Open Graph and Twitter Card tags
- ✅ Dynamic `sitemap.xml` at `/sitemap.xml`
- ✅ `robots.txt` at `/robots.txt` (blocks `/admin/` and `/api/`)
- ✅ Google site verification meta tag
- ✅ `<Image>` components with lazy loading and WebP
- ✅ Semantic HTML headings
- ✅ Static generation for category pages

---

## 7. Adding Products

Currently the product category pages show a fallback message (text description) if no products are added. To add product images:

1. Go to **Admin → Products → Add Product**
2. Set category, name, description
3. Paste image URLs (you can use Wix image URLs temporarily, or upload to Supabase Storage and paste the public URL)

---

## License
© 2024 Smart Corporate Solutions F.Z.E L.L.C — All rights reserved.
