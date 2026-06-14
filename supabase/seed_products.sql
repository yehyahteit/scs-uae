-- ── SEED PRODUCTS WITH ALL IMAGES FROM SCS-UAE.COM ───────────────────────
-- Run in Supabase SQL Editor. Safe to re-run (deletes old products first).

delete from products;

insert into products (category_id, name, description, images, is_featured, is_active, sort_order)
values

-- 1. Restaurant & Hotel Uniform
(
  (select id from categories where slug = 'restaurant'),
  'Hotels & Restaurant Uniform',
  'Jacket & Coats, Shirt, Trousers, Dress, Skirt, Neck Tie, Scarf, Belt, Shoes, Apron, Hats, and more. Premium quality uniforms for the hospitality industry.',
  array[
    'https://static.wixstatic.com/media/bf2fa2_5e5ca697bd6549b7b627dd3724857939~mv2.jpeg',
    'https://static.wixstatic.com/media/bf2fa2_c2bbf84b937d4f04be53381926ed90a0~mv2.jpeg',
    'https://static.wixstatic.com/media/bf2fa2_9a3c13cdf5a84a4ea8eb115b441331a3~mv2.jpeg',
    'https://static.wixstatic.com/media/bf2fa2_d6b7ceab6fcb422b9d6154a639bc4f49~mv2.jpeg'
  ],
  true, true, 1
),

-- 2. Medical Uniform
(
  (select id from categories where slug = 'medical'),
  'Medical Uniform',
  'Doctor Labcoat, Nurse Scrubs, Lab Gown, Patient''s Gown, Shoes, Name Badges, and more. Designed for hygiene, comfort and professionalism.',
  array[
    'https://static.wixstatic.com/media/bf2fa2_d6b7ceab6fcb422b9d6154a639bc4f49~mv2.jpeg',
    'https://static.wixstatic.com/media/bf2fa2_c2bbf84b937d4f04be53381926ed90a0~mv2.jpeg'
  ],
  true, true, 2
),

-- 3. Facility Management
(
  (select id from categories where slug = 'facility'),
  'Housekeeping & Facility Management Uniform',
  'Scrubs, Shirts, Polo Shirts, Trousers, Apron, Bandana, Long Dress Types, and more. Practical and durable uniforms for facility and housekeeping teams.',
  array[
    'https://static.wixstatic.com/media/bf2fa2_9a3c13cdf5a84a4ea8eb115b441331a3~mv2.jpeg',
    'https://static.wixstatic.com/media/bf2fa2_5e5ca697bd6549b7b627dd3724857939~mv2.jpeg'
  ],
  true, true, 3
),

-- 4. Industrial & Safety
(
  (select id from categories where slug = 'safety'),
  'Industrial & Safety Uniform',
  'Overall, Coveralls, Jackets, Hi Visibility Wear, Suits, Cargo Trousers, Cargo Shorts, Safety Vest, Shoes, Sweatshirt, Shirts, and more.',
  array[
    'https://static.wixstatic.com/media/bf2fa2_0ec2c06a7a964bc1a54a72ebf5e6f468~mv2.jpeg',
    'https://static.wixstatic.com/media/bf2fa2_ea3e8a6af56b4d3e89a87fd4490d9ecc~mv2.jpeg'
  ],
  true, true, 4
),

-- 5. SPA & Salon
(
  (select id from categories where slug = 'spa'),
  'SPA & Salon Uniform',
  'Scrubsuit, Tunic Dress, Shirts, Dress, Trouser, Skirts, Name Badges, and more. Elegant and comfortable uniforms for wellness and beauty professionals.',
  array[
    'https://static.wixstatic.com/media/bf2fa2_261cdaa2b8284d5cbc5e626ebe9f459d~mv2.jpeg',
    'https://static.wixstatic.com/media/bf2fa2_c2bbf84b937d4f04be53381926ed90a0~mv2.jpeg'
  ],
  true, true, 5
),

-- 6. Schools & Nursery
(
  (select id from categories where slug = 'school'),
  'Schools & Nursery Uniform',
  'Shirts, Pants, Skirts, Winter Jackets, Varsity Jackets, T-Shirts, Polo Shirts, Hoodies, and more. Smart and durable uniforms for schools and nurseries.',
  array[
    'https://static.wixstatic.com/media/bf2fa2_aaec700f92234f708a028eaf0e42bb18~mv2.jpeg',
    'https://static.wixstatic.com/media/bf2fa2_54cf1fcd1e6f48d685021eab3fe9ee1a~mv2.jpeg'
  ],
  true, true, 6
),

-- 7. Corporate Uniform
(
  (select id from categories where slug = 'corporate'),
  'Corporate Uniform',
  'Jacket/Suit, Shirt, Trousers, Dress, Skirt, Neck Tie, Scarf, Belt, Shoes, and more. Professional corporate uniforms tailored to your brand identity.',
  array[
    'https://static.wixstatic.com/media/bf2fa2_54cf1fcd1e6f48d685021eab3fe9ee1a~mv2.jpeg',
    'https://static.wixstatic.com/media/bf2fa2_5e5ca697bd6549b7b627dd3724857939~mv2.jpeg'
  ],
  true, true, 7
),

-- 8. Embroidery Services
(
  (select id from categories where slug = 'embroidery'),
  'Embroidery Services',
  'Fabrics, Hats, 3D Embroidery, Flat Embroidery, Patch Embroidery, Woven Patch. High-quality custom embroidery for any garment or accessory.',
  array[
    'https://static.wixstatic.com/media/bf2fa2_840ef9d49a1e4da599c7ecbde2921092~mv2.jpeg'
  ],
  false, true, 8
),

-- 9. Printing Services
(
  (select id from categories where slug = 'printing'),
  'HTV & Sublimation Printing Services',
  'Smooth, Puff, Reflective, Glitter, Foil, Flock, Metal Vinyl printing on Fabrics, Hats, Metal, Ceramic, Stickers, and more.',
  array[
    'https://static.wixstatic.com/media/bf2fa2_c166999b60dd42a39ca3fb2de364158d~mv2.jpeg'
  ],
  false, true, 9
);
