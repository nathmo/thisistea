# ThisIsTea: showcase site

The landing page for [ThisIsTea](https://github.com/StygianSummer/Lauzhack), a self-paced cyber literacy
course built at LauzHack 2026: Duolingo-style lessons, then realistic practice where the prompts fade,
so learners build a four-step habit for spotting phishing and scams.

- **Live app:** https://stygiansummer.github.io/Lauzhack/
- **App source:** https://github.com/StygianSummer/Lauzhack

## What's here

| Path | What |
|---|---|
| `index.html` | The whole page |
| `assets/css/site.css` | Styles, built on the app's design tokens (`static/tea-theme.css` in the app repo) |
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
