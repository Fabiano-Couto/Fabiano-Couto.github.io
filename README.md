# Fabiano-Couto.github.io

Personal site served at [fabianocouto.me](https://fabianocouto.me) by GitHub Pages.

Static HTML, CSS and JavaScript, no build step. Content is bilingual (English / Portuguese):
each text has a `data-l="en"` and a `data-l="pt"` version and the CSS hides the inactive one.

- `index.html`: all content
- `assets/css/style.css`: design tokens (light and dark) and layout
- `assets/js/main.js`: language switch, charts (sample data), reveal animations, mobile menu
- `assets/icons.svg`: Phosphor icons sprite
- `assets/img/`: photos (Unsplash License) and profile picture

Run locally: `python -m http.server 8080` and open http://localhost:8080
(the icon sprite does not load over `file://`).
