# Tamim Chowdhury — Video Editor Portfolio

Sci-fi, motion-heavy single-page portfolio for video editor **Tamim Chowdhury** (cars & bikes). Pure static files — no build step — ready for **GitHub Pages**.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages

1. Create a new GitHub repository and push this folder.
2. Go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Select `main` (or `master`) and `/ (root)`.
5. Save — your site will be at `https://<username>.github.io/<repo>/`.

If the site is on a project path (not a custom domain / user site), links already use relative paths (`css/`, `js/`), so they work as-is.

## Customize

| What | Where |
|------|--------|
| Brand name | `index.html` — hero, nav, title |
| Email / socials | Contact section in `index.html` |
| Project media | Swap Unsplash images + sample MP4s in Work |
| Showreel | `#reel` video `src` / `poster` |
| Colors | CSS variables in `css/styles.css` (`:root`) |

Dummy media currently comes from Unsplash and Google’s sample video bucket — replace with real cuts when ready.

## Stack

- HTML / CSS / vanilla JS
- [GSAP](https://gsap.com/) + ScrollTrigger (CDN)
- [Lenis](https://lenis.darkroom.engineering/) smooth scroll (CDN)
- Google Fonts: Unbounded + Manrope
