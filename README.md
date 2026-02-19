# Unit 4: Probability and Statistical Inference — Demos

Interactive web demos for Big Data Analytics (CMP-SC 4350/7350), Unit 4.

## How to run

Open `index.html` in a web browser. No build step or server required.

```bash
# From this folder:
open index.html

# Or use a simple HTTP server (optional):
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Structure

- `index.html` — Navigation hub
- `css/style.css` — Shared styles
- `js/shared.js` — KaTeX rendering and utilities
- `demos/` — One HTML file per section (4.1–4.8)

## Dependencies (CDN)

- KaTeX (math rendering)
- Chart.js (graphs) — loaded in demos that need it
