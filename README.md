# Can Alexa Eat That?

A front-end-only static website that lets friends quickly look up what Alexa
can and can't eat, powered by a simple fuzzy-search over two plain-text lists.

## Repository layout

```
data/
  WHITELIST.txt   ← master list of allowed foods (candies / safe items)
  BLACKLIST.txt   ← master list of denied foods  (vegetables / unsafe items)
src/
  index.html    ← single-page UI template
  style.css     ← minimal styles
  app.js        ← data loading, Levenshtein fuzzy-search, rendering
```

## Editing the lists

Each file follows a simple line format:

```
Item Name: short, helpful description
```

Add or remove lines in `data/WHITELIST.txt` or `data/BLACKLIST.txt` — then
rebuild the site. The data is loaded at runtime via `fetch()`.

## Building

Install dependencies once, then run the build:

```bash
npm install
npm run build   # generates index.html, style.css, app.js at repo root
```

## Running locally

```bash
npm start       # Eleventy dev server at http://localhost:8080/
```

## Deploying

After running `npm run build`, the repo root contains everything needed to serve
the site. For **GitHub Pages**, configure Pages to serve from the repo root
(branch `main`, folder `/`).
