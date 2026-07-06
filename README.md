# Zhijiang Wang — Portfolio

Personal portfolio site for Zhijiang Wang, a secondary school Technology &amp; Visual Arts
teacher in Auckland, New Zealand.

An editorial, single-page site with a disciplines grid (Web, Graphic, E-Learning, 3D,
Unity, Textile, Food Tech, Video) where each category opens a carousel of projects.

## Stack
Plain HTML, CSS and JavaScript — no build step. Type set in Archivo, Space Grotesk and
Space Mono.

```
index.html    markup
styles.css    styles / layout
main.js       mobile nav, scroll reveal, project carousel (edit DISCIPLINES to add work)
assets/       images, video, PDF (not committed yet)
```

## Run locally
Serve the folder with any static server, e.g.:

```bash
python3 -m http.server 4319
```

Then open http://localhost:4319

## Note
Image/video/PDF assets are currently gitignored. Add them to `assets/` and reference them
in `main.js` (the `DISCIPLINES` object) and `index.html`.
