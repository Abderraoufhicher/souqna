# SOUQNA — سوقنا

A responsive Arabic/French marketplace frontend evolved from the BUNYAN MARKET DZ prototype.

## Included in this version
- SOUQNA premium visual identity: navy, champagne gold, warm cream and restrained category accent colors.
- Arabic RTL / French LTR interface with a visible language switch and saved preference.
- Light and dark themes with saved preference.
- Marketplace categories, product cards, store directory, search and wilaya filtering.
- Demo account selection (merchant / individual), merchant store creation, product creation and local merchant dashboard.
- Favorites, product comparison, direct phone/WhatsApp links, local demo chat, reviews, RFQ form, delivery settings and ad promotion request UI.
- A Supabase SQL schema with RLS policies for the planned production backend.

## Important status
This is a **front-end demonstration / MVP**, not yet a production marketplace. The browser demo persists data in `localStorage` on the current device. It does not create real cross-device accounts, deliver messages to other users, process payments, upload files to cloud storage, verify merchants, send quote requests to suppliers, or charge for promoted listings. Those require a configured Supabase project, storage buckets, authentication, server-side policies and a payment provider.

## Deploying the frontend
Upload `index.html`, `styles.css`, and `app.js` to the web root of a static host or connect this repository to Cloudflare Pages. No build step is required.

## Enabling the backend
1. Create a Supabase project.
2. Review and run `supabase/schema.sql` in the Supabase SQL Editor.
3. Create `store-assets` and `product-images` storage buckets and add storage access policies.
4. Add Supabase Auth and replace the local demo account flow with Supabase Auth.
5. Connect products, stores, favorites, conversations, messages, RFQ, reviews, campaigns and analytics to the schema.
6. Test every RLS policy with separate merchant and individual accounts before launch.
7. Integrate a supported payment provider before enabling paid promotion.

Never put a Supabase `service_role` key in browser code. Only use the public anon/publishable key in a frontend, with RLS correctly configured.

## Demo sample data
The initial sample stores and products are illustrative placeholders, not verified merchants or live inventory. Replace them before public launch.
