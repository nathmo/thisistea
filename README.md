# ThisIsTea: showcase site

The landing page for [ThisIsTea](https://github.com/StygianSummer/Lauzhack), a self-paced cyber literacy
course built at LauzHack 2026: Duolingo-style lessons, then realistic practice where the prompts fade,
so learners build a four-step habit for spotting phishing and scams.

- **Live app:** https://stygiansummer.github.io/Lauzhack/
- **App source:** https://github.com/StygianSummer/Lauzhack

## How the app is built (summary of the page's "Writeup" section)

**Architecture**

```
 Web (wasmJs)   Desktop (JVM)   Android          thin platform shells
        \            |            /
     shared/  Kotlin Multiplatform + Compose      every screen, theme, engines (placement,
        |                                         BKT mastery, fading, selection, XP), content
        |  content/  JSON packs (en/fr/es)        loading + validation, i18n, offline sync queue
        |
        |  HTTPS, one origin:  /  → app,  /api → server
        v
 ┌─ Docker Compose ──────────────────────────────┐
 │  Caddy (web, auto HTTPS)                      │
 │    → Ktor server (accounts, sync, leaderboard,│
 │                   practice-email scheduler)   │
 │      → PostgreSQL 16 (Exposed; H2 in tests)   │
 └───────────────────────────────────────────────┘
 GitHub Actions: tests on every push · Wasm mirror on Pages · screenshots of every screen
```

**Key decisions** (full log: [`docs/decisions.md`](https://github.com/StygianSummer/Lauzhack/blob/main/docs/decisions.md))

| Decision | Why |
|---|---|
| One Kotlin codebase (KMP + Compose), no JS front end | One place to fix a bug; theme, dark mode and translations work on every platform |
| Engines are pure Kotlin in `commonMain`, shared with the server | Unit-tested; XP computed the same way on client and server |
| Content is JSON with a fixed shape (a contract) | Writers and coders work in parallel; a new language is files only |
| Containerised backend behind one origin (Caddy + Ktor + Postgres) | Same stack on any host; no CORS, no tunnel URLs; dev compose needs no `.env` |
| Offline-first, guest by default | Works on flaky networks; the demo never depends on the venue Wi-Fi |
| Privacy first; AI behind an interface with a rules fallback | Click-only practice email, hashed passwords; no live AI calls in what ships |

**How we used LLM coding agents.** We wrote the details down before any code, so the agents had
nothing to invent: the idea and an append-only decision log (agents propose, humans decide); the
style prototyped in HTML/CSS plus a design guide and character sheets; one MVP 0 plan as the single
source of truth, planned with JetBrains Air, Claude and other AI assistants (game loop, data contracts C1–C5, engine constants, every screen, deployment, safety
rules); and one `AGENTS.md` brief that every agent reads (Claude Code via a one-line `CLAUDE.md`).
Later modules (Boardroom crisis, password Vault drill, storytelling) each started from their own
brief. Work was split the traditional way: one git branch per person, small PRs reviewed by a
teammate, file ownership, and handoff files for questions between agents.

## What's here

| Path | What |
|---|---|
| `index.html` | The whole page |
| `assets/css/site.css` | Styles, built on the app's design tokens (`static/tea-theme.css` in the app repo) |
| `assets/css/writeup.css` | Styles for the "Writeup" section (architecture diagram, workflow, git graph) |
| `assets/js/site.js` | Scroll reveals, lesson tabs, and the four-step mini demo |
| `assets/img/shots/` | App screenshots, cropped from the app repo's `screenshots` branch |
| `assets/img/guides/` | The four guides (Cat, Turtle, Dog, Spider) from the app's drawables |
| `.github/workflows/pages.yml` | Deploys the site to GitHub Pages on every push to `main` |

No build step and no dependencies: open `index.html` in a browser to preview.

## Publishing

One-time: **Settings → Pages → Build and deployment → Source: GitHub Actions**. After that every push to
`main` redeploys.

## Updating screenshots

The source images come from the app repo's `screenshots` branch (rendered by its jvm tests). Crop them to
remove the debug footer and offline banner, save them as WebP into `assets/img/shots/`, and keep the
file names used in `index.html`.

The mini demo's email and answers come from `content/items/email/email-parcel-fee-01.en.json` in the
app repo. All brands are fictional and every address is on `.example`.
