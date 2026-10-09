# Portfolio — Jason Jay Ababao

Personal portfolio built with **Next.js 16 + React 19 + TypeScript**, deployed on Vercel from `main`.

It was rebuilt from a plain HTML/CSS/JS version, which is still in the git history:
`git show d11c94b --stat` lists its files, and `git checkout d11c94b -- index.html` restores one.

## Run it

```bash
npm install      # first time only
npm run dev      # open http://localhost:3000 — edits reload instantly
npm run build    # production build (shows which pages are static)
npm run lint     # code checks
```

## Contact form email (Resend)

The form on `/contact` calls a **Server Action** (`src/app/contact/actions.ts`) that emails the message to
your Gmail through [Resend](https://resend.com). It needs one secret, `RESEND_API_KEY`:

1. Sign up at resend.com **with jasonjay.ababao1968@gmail.com**. Without a verified domain, Resend only
   delivers to the address you signed up with.
2. Create an API key at resend.com/api-keys.
3. **On your PC:** copy `.env.example` to `.env.local`, paste the key after `RESEND_API_KEY=`, then restart
   `npm run dev`. `.env.local` is ignored by git, so the key never goes to GitHub.
4. **On Vercel:** Project → Settings → Environment Variables → add `RESEND_API_KEY`, then redeploy.

Messages arrive from `onboarding@resend.dev` with the subject `Portfolio: …`. Pressing **Reply** in Gmail
answers the visitor directly. If sending ever fails, the form shows your email address instead, so no
visitor is left stuck.

## The one rule of routing: folders = URLs

Every `page.tsx` inside `src/app` is a page. Its folder path is its URL.

| URL                         | File                                   | What to learn there                              |
| --------------------------- | -------------------------------------- | ------------------------------------------------ |
| `/`                         | `src/app/page.tsx`                     | Server page mixing in Client Components          |
| `/about`                    | `src/app/about/page.tsx`               | `metadata` export → the page `<title>`           |
| `/skills`, `/skills#roadmap`| `src/app/skills/page.tsx`              | Rendering cards from a data array with `.map()`  |
| `/projects?filter=shopify`  | `src/app/projects/page.tsx`            | `useSearchParams` + `<Suspense>`                 |
| `/projects/curakidney`      | `src/app/projects/[slug]/page.tsx`     | **Dynamic route**, `generateStaticParams`, `notFound()` |
| `/experience`               | `src/app/experience/page.tsx`          | Simple list page                                 |
| `/process`                  | `src/app/process/page.tsx`             | Simple list page                                 |
| `/contact`                  | `src/app/contact/page.tsx`             | Controlled form + **Server Action** (`actions.ts`) |
| `/api/projects`             | `src/app/api/projects/route.ts`        | **Route handler**: an API that returns JSON      |
| any unknown URL             | `src/app/not-found.tsx`                | Custom 404 page                                  |
| (every page)                | `src/app/layout.tsx`                   | Root layout: nav, footer, chat, fonts, theme     |

## Folder map

```
src/
├── app/                  ROUTES (pages, layout, API, global CSS)
├── data/                 CONTENT — edit these to change the site's text
│   ├── site.ts             name, email, WhatsApp, stats
│   ├── navigation.ts       menu links
│   ├── projects.ts         all 14 projects + filter helpers
│   ├── skills.ts           skills AND the AI roadmap
│   ├── experience.ts       job history
│   └── process.ts          the 4 process steps
├── components/           UI BUILDING BLOCKS
│   ├── layout/             Nav, Footer, Logo, ThemeToggle, Background
│   ├── ui/                 Icon, SectionHeader, Tags, SkillCard, …
│   ├── home/               hero canvas, typing terminal, counters
│   ├── projects/           ProjectCard, ProjectFilter
│   ├── contact/            ContactForm
│   ├── assistant/          chat: answers.tsx (brain), provider (state), panel (UI)
│   ├── palette/            Ctrl+K command menu
│   ├── effects/            scroll reveal, cursor effects, progress bar
│   └── Providers.tsx       all React Contexts in one place
└── lib/                  plain helper functions (theme, motion checks)
```

## Suggested study order

1. **`src/data/projects.ts`**: content is plain data, separate from the design.
2. **`src/app/layout.tsx`**: what wraps every page, and why the chat stays open between pages.
3. **`src/app/about/page.tsx`**: the simplest page.
4. **`src/components/projects/ProjectCard.tsx`**: a component that takes props; also `next/image` and `<Link>`.
5. **`src/app/projects/[slug]/page.tsx`**: one file making 14 pages.
6. **`src/components/projects/ProjectFilter.tsx`**: the URL as state.
7. **`src/components/layout/Nav.tsx`**: `usePathname()` for the active link, `useState` for the mobile menu.
8. **`src/components/assistant/`**: React Context (`AssistantProvider`) shared by many components.
9. **`src/components/home/HeroTerminal.tsx`**: an animation driven by state + `useEffect`.
10. **`src/app/api/projects/route.ts`**: your first API endpoint.

## Key ideas, in one line each

- **Server Component** (the default): runs on the server/at build time and ships no JavaScript. Use it for content.
- **Client Component** (`'use client'` at the top): runs in the browser. Needed for `useState`, `useEffect`, clicks and typing.
- **`<Link href="/about">`**: switches pages without a full reload.
- **`useRouter().push('/about')`**: the same thing, from code (see the command palette).
- **`metadata` / `generateMetadata`**: set `<title>` and description per page.
- **`params` is a Promise** in Next.js 16: `const { slug } = await params`.
- **Cache Components** (`next.config.ts`): pages are prerendered. Anything that reads the URL at runtime
  (`useSearchParams`) must sit inside `<Suspense>`.

## Compared with the original HTML site

| Original (commit `d11c94b`)                     | Next.js version                                    |
| ----------------------------------------------- | -------------------------------------------------- |
| One long `index.html`, sections with `#anchors` | Separate routes, one folder per page               |
| HTML repeated per project card                  | One `ProjectCard` + data in `projects.ts`          |
| `script.js` queries the DOM and edits it        | Components hold state; React updates the DOM       |
| Assistant builds HTML strings                   | Assistant returns JSX (safe, real `<Link>`s)       |
| SVG sprite `<use href="#i-arrow">`              | `<Icon name="arrow" />`                            |
| Google Fonts `<link>`                           | `next/font` (self-hosted, no layout shift)         |
| No project pages                                | `/projects/[slug]` detail pages + `/api/projects`  |

`src/app/globals.css` is the original `style.css`, with the few additions marked "Next.js version".
