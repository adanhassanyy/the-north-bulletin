# The North Bulletin

**The Voice of Northern Kenya** — a mobile-first news and media front end built with React, Vite, Tailwind CSS, lucide-react, and Recharts.

This repo contains the front-end prototype only: homepage, category/county pages, search, article pages (comments, related stories, author profiles, AI-style recommendations), and a full admin dashboard UI (article management, comment moderation, users, newsletter, analytics, settings). All data is mocked in `src/App.jsx` — there is no backend yet.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

The build output goes to `dist/`.

## Project structure

```
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── src/
    ├── main.jsx      # React entry point
    ├── index.css     # Tailwind directives
    └── App.jsx       # Entire site + admin dashboard (single file)
```

---

## Push this to GitHub

From inside this folder:

```bash
git init
git add .
git commit -m "Initial commit: The North Bulletin front end"
git branch -M main
git remote add origin https://github.com/<your-username>/north-bulletin.git
git push -u origin main
```

(Create the empty repo first at github.com/new — don't initialize it with a README there, to avoid a merge conflict.)

## Deploy it for free

**Vercel** (recommended, zero config for Vite):
1. Go to vercel.com → New Project → import your GitHub repo.
2. Framework preset: Vite. Build command `npm run build`, output dir `dist` (auto-detected).
3. Deploy — you get a live URL immediately, and every future push to `main` redeploys automatically.

**Netlify:**
1. netlify.com → Add new site → Import from GitHub.
2. Build command: `npm run build`. Publish directory: `dist`.

**GitHub Pages:**
1. `npm install -D gh-pages`
2. Add to `package.json`: `"homepage": "https://<username>.github.io/north-bulletin"` and a script `"deploy": "gh-pages -d dist"`.
3. `npm run build && npm run deploy`

---

## What's mocked vs. what's real

Real: full UI/UX, layout, responsive behavior, client-side routing (via React state), search, comment posting (session-only), admin CRUD interactions (session-only).

Mocked / not yet wired: article data (hardcoded array in `App.jsx`), images (placeholder URLs from picsum.photos — replace with your own), authentication, comment persistence, newsletter sending, analytics numbers.

## Turning this into a real news platform

To go from this prototype to production, you'll need:

1. **A backend + database** — e.g. Node/Express or Django + PostgreSQL, or a headless CMS (Strapi, Sanity, or WordPress as a headless API) to store articles, authors, comments, and users instead of the hardcoded array.
2. **Authentication & roles** — for editor login and the admin dashboard (e.g. Auth.js/NextAuth, Clerk, or a custom JWT setup), with role-based permissions (editor, reporter, moderator).
3. **Image/video hosting** — Cloudinary, AWS S3, or similar, wired into the "Upload" button in the admin article editor.
4. **Newsletter delivery** — an email provider (Mailchimp, SendGrid, Postmark) connected to the "Send Newsletter" action.
5. **Comment moderation backend** — persisted comments with an approve/reject queue.
6. **SEO & Google News** — server-side rendering or static generation (Next.js is the natural upgrade path from Vite for this), a proper `sitemap.xml` and `news-sitemap.xml`, structured data (`NewsArticle` schema.org JSON-LD on every article page), and submission through Google Search Console / Google Publisher Center.
7. **AdSense & direct ads** — replace the dashed ad placeholder boxes with real AdSense `<ins>` tags (after AdSense account approval) or your own ad-server tags for direct advertisers.
8. **Analytics** — Google Analytics 4 or Plausible for real traffic data, replacing the mocked charts in the admin dashboard.
9. **Domain & hosting** — buy a domain (e.g. thenorthbulletin.co.ke), point it at your Vercel/Netlify deployment.
10. **Accessibility & performance audit** — run Lighthouse before launch; the UI already respects focus states and semantic structure, but real content (alt text, captions on video) needs to be added as you populate it.

If you want, the next steps I can help with directly: converting this to Next.js for SEO/SSR, wiring up a specific CMS or backend, or writing the JSON-LD/sitemap code.
