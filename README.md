# WrapSense Packaging — website

Static site for [wrapsensepackaging.com](https://www.wrapsensepackaging.com), built with a small zero-dependency Node generator and deployed on Vercel. One serverless function (`/api/lead`) delivers quote requests.

```
npm run build          # → dist/
npm run dev            # build + local preview at http://localhost:4321 (no API)
npm run check          # build + QA: links, images, titles/descriptions, headings, labels, sitemap
npm run fetch-images   # download images that only exist on the old WordPress site (run before launch)
```

Requires Node 18+. No `npm install` needed.

## Where things live

| Path | What |
|---|---|
| `src/data/products.mjs` | **Every machine** — specs, models, uses, package formats, finder tags, old URLs |
| `src/data/categories.mjs` | Machine categories (SEO titles, intros, catalog page numbers, accent colors) |
| `src/data/industries.mjs` | Industry pages: intro, benefits, stage notes, curated machine list, typical line, FAQs. **Source of truth for which machines belong to which industry** (mirrored onto products at build) |
| `src/data/site.mjs` | Contact details, line stages, finder questions, services, process, optional GTM ID |
| `src/data/blog.mjs` | Blog posts (markdown subset; `p:`/`c:`/`i:` links resolve to machine, category and industry pages and are validated at build) |
| `src/data/legacy-images.mjs` | Images still sourced from the old site (see launch checklist) |
| `build/` | Generator: `layout.mjs` (head/SEO/header/footer), `pages*.mjs` (templates), `components.mjs` |
| `src/assets/` | CSS, JS, fonts (self-hosted Oswald + Poppins), images, catalog PDF |
| `api/lead.js` | Vercel function: validates, filters spam, emails and/or forwards leads |
| `tools/` | Image extraction from the catalog, OG image generator, QA checker, dev server |
| `vercel.json` | Build settings, 301 redirects from every old URL, security & cache headers |

Adding a machine = add an object to `products.mjs` (and an image in `src/assets/img/products/`). Its page, category listing, finder matching, industry pages, sitemap and quote-form dropdown all update on the next build. Re-run `python3 tools/og-images.py` to create its social image.

## Blog

`/blog/` holds problem- and FAQ-style buying guides. It's kept out of the main menu and linked from the footer, the home page, the quote page and a "Guides & answers" strip on every machine, category and industry page a post links to (computed automatically). Each post gets BlogPosting + FAQPage structured data, a table of contents, a share image and a sitemap entry with its publish date. To add a post, append to `src/data/blog.mjs`, then run `python3 tools/og-images.py` to generate its share image.

## Site search

The search icon in the header (or `/` or Ctrl/⌘ K) opens instant search across machines, categories, industries, blog guides and key pages. `build/search-index.mjs` writes `assets/search-index.json` at build time; it's fetched only when search is first opened. It includes common shop-talk aliases ("vffs", "taper", "combi", "doypack"…) and corrects small typos. Pressing Enter goes to `/search/?q=…` (noindex). Searches are pushed to `dataLayer` as `site_search`, so you can see what customers look for.

## The Machine Finder

`/machine-finder/` asks four questions — product type (the radial wheel), package format, output, and add-ons — then ranks machines by product + package fit and speed overlap, and assembles a suggested line. Matching uses the `forms`, `packages`, `speed`, `role` fields on each product. Answers live in the URL (shareable, back-button friendly) and flow into the quote form.

## HubSpot (quote form → HubSpot Contacts)

1. In HubSpot, create a form (Marketing → Forms) with these fields: **First name, Last name, Email, Phone number, Company name, Postal code, Message**. You don't need to embed it anywhere. It only needs to exist.
2. Copy the form's GUID (it's in the form's URL / embed code) and your Hub ID (Account → top-right menu).
3. In Vercel → Settings → Environment Variables, set `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_GUID`, then redeploy.

Every quote/service/financing request is then submitted to that form, so it creates or updates a HubSpot contact, appears under the form's submissions, and can trigger HubSpot workflows (auto-replies, owner assignment, deal creation). The **Message** field holds the full project details plus lead source: product, package, output, timeline, machines of interest, UTM/ad-click source, Machine Finder answers and any financing-calculator estimate. To also fill custom HubSpot properties, add them to the form and set e.g. `HUBSPOT_EXTRA_FIELDS=timeline:purchase_timeline,product:packaging_product`.

Setting `HUBSPOT_PORTAL_ID` also loads HubSpot's tracking code on every page (build time), so each contact's timeline shows the pages they viewed and their original traffic source. Turn on HubSpot's cookie banner under Settings → Privacy & Consent if you need consent before tracking.

## Lead delivery (set before launch)

In Vercel → Project → Settings → Environment Variables:

| Variable | Purpose |
|---|---|
| `HUBSPOT_PORTAL_ID` / `HUBSPOT_FORM_GUID` | HubSpot delivery (see above) |
| `RESEND_API_KEY` | Email delivery via [Resend](https://resend.com) (verify the wrapsensepackaging.com domain there) |
| `LEAD_TO_EMAIL` | Recipient(s), comma-separated. Default `sales@wrapsensepackaging.com` |
| `LEAD_FROM_EMAIL` | e.g. `WrapSense Website <leads@wrapsensepackaging.com>` |
| `LEAD_WEBHOOK_URL` | Optional: POSTs the full lead as JSON (GoHighLevel, HubSpot, Zapier, Make…) |
| `LEAD_WEBHOOK_SECRET` | Optional: sent as `X-Webhook-Secret` |

HubSpot, email and webhook can be used together; a lead counts as delivered if any one succeeds. With neither set, the form shows a "call or email us" fallback and the lead is written to the function log, so set at least one before go-live.

## Lead tracking

`site.js` records first-party attribution in `localStorage` (no cookies): first touch and latest touch (UTM tags, `gclid`/`fbclid`/`msclkid`, referrer, landing page), visit count, pages this session, machines viewed and Machine Finder answers. It's attached to the lead when the form is submitted and shown in the lead email. With Global Privacy Control on, it's kept for the session only. Expect some leads to arrive without a source (blocked storage, other devices, private browsing) — attribution is never 100%.

Events are also pushed to `window.dataLayer` (`generate_lead`, `finder_start`, `finder_complete`, `phone_click`, `email_click`, `catalog_download`, `form_start`, `form_error`, `machines_filter`, plus `data-track` CTA clicks). Add a GTM container ID in `src/data/site.mjs` to forward them to GA4 / Google Ads / Meta.

## Financing

`/financing/` has a cost-analysis calculator (labor savings, hours saved, added production, payment, payback) and "Apply" buttons. Set the lender's name and application URL in `financing` in `src/data/site.mjs`; until then, Apply goes to the quote form with *Equipment financing* selected. Calculator estimates are attached to the lead.

## Launch checklist

1. `npm run fetch-images` **while the old WordPress site is still live**, then commit `src/assets/img/legacy/`. Otherwise those 16 images (inspection, conveyors, specialty, film, WS-300, reciprocating wrapper) break when DNS moves.
2. Set the lead env vars above and send a test lead.
3. Point the domain at Vercel. The old URLs are 301-redirected to their new pages in `vercel.json`.
4. Submit `https://www.wrapsensepackaging.com/sitemap.xml` in Google Search Console.
5. Ask the client for higher-resolution product photos where they exist: catalog images are small, so they've been upscaled modestly.

## Accessibility & SEO

WCAG 2.2 AA target, with zero axe-core violations on the audited templates at desktop and mobile. Native form controls drive the wheel and finder, so they work with a keyboard and screen readers. The site has skip links, landmarks, visible focus, reduced-motion support and accessible error summaries. Every page gets a unique title and description, a canonical URL, Open Graph and Twitter tags with per-machine share images, JSON-LD (Organization, WebSite, BreadcrumbList, CollectionPage/ItemList, Service, ContactPage), an XML sitemap and robots.txt. The catalog PDF is served `noindex` so it doesn't compete with the machine pages.


## Case studies

Data: `src/data/case-studies.mjs` (body copy uses the blog link syntax `[text](p:|c:|i:slug)`, validated at build).
Pages: `/case-studies/` and `/case-studies/<slug>/`, plus case-study strips on the home page and on matching
industry, category and product pages, a footer link and search entries.

The three current entries come from the client prototype and are **placeholders** (made-up customers, numbers
and quotes), so they're marked `draft: true`:

- Local and Vercel **preview** builds show them with a "placeholder" banner, `noindex`, and no sitemap/search entries.
- **Production** builds (`VERCEL_ENV=production`) leave them out completely: no pages, links, sitemap or search.
- Override with `SHOW_DRAFTS=1` or `SHOW_DRAFTS=0`.

To publish one: replace the customer, numbers and quote with real, approved details and delete `draft: true`.
