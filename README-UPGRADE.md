# SOUQNA — سوقنا | Upgrade package

## Included in this package
- `platform.js`: Supabase email/password authentication, negotiation offers, expiring 24-hour image/video stories, nearby store discovery with optional GPS, derived trust indicators and merchant analytics.
- `supabase/migrations/202611270001_souqna_platform.sql`: schema extension for negotiations, stories, branches, orders, coupons, price alerts, notifications, reports, and trust summary.
- `supabase-config.example.js`: safe public-key configuration template.
- `styles-platform.css`: responsive styles for the new platform modules.
- `index-additions.html.txt`: script and manifest tags to add to the existing index.
- `manifest.webmanifest` and `sw.js`: PWA shell.

## Install into GitHub
Upload these files to the `Souqna` branch only. Keep `main` unchanged.
1. Add the new files at the same paths shown in this package.
2. Append `styles-platform.css` contents to the end of existing `styles.css`, OR add `<link rel="stylesheet" href="styles-platform.css">` to `index.html`.
3. Add the script tags from `index-additions.html.txt` immediately before `</body>`.
4. Copy `supabase-config.example.js` to `supabase-config.js` and add your Supabase Project URL and public anon/publishable key. Do not commit service_role keys.
5. In Supabase SQL Editor, run the existing `schema.sq1` first, then run `supabase/migrations/202611270001_souqna_platform.sql`.
6. Create Storage buckets `store-assets` and `product-images`; configure upload policies for authenticated store owners.
7. Deploy the site over HTTPS.

## Honest status / dependencies
The existing marketplace interface remains a local demo until Supabase is configured and the old demo account flow is migrated. This package adds a separate Supabase-backed platform module for the features listed above; it does not silently convert local demo accounts.
- BaridiMob/online payment: no payment gateway connected.
- Courier integrations, push notifications, live streaming, image search and AI: require provider/API setup and further implementation.
- Admin verification/moderation and complete checkout/order processing: database foundation exists, workflows still need implementation.
- Trust score is derived from database signals and is not a guarantee or certification.
- GPS is optional; wilaya filtering works without location permission.

## Security
RLS policies are included for the added tables. Test with separate buyer and merchant accounts before launch. Never expose Supabase `service_role` credentials in frontend code.
