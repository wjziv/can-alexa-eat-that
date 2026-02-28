# Can Alexa Eat That?

A front-end-only static website that lets friends quickly look up what Alexa
can and can't eat, powered by a simple fuzzy-search over two plain-text lists.

## Repository layout

```
index.html       ← single-page UI served from root (`/`)
style.css        ← minimal styles
app.js           ← data loading, Levenshtein fuzzy-search, rendering
data/
  WHITELIST.txt  ← master list of allowed foods (candies / safe items)
  BLACKLIST.txt  ← master list of denied foods  (vegetables / unsafe items)
```

## Editing the lists

Each file follows a simple line format:

```
Item Name
# or
Item Name: short, helpful description
```

Add or remove lines in `data/WHITELIST.txt` or `data/BLACKLIST.txt` — the site picks up
the changes automatically on next load.

## Running locally

Install dependencies and run the Eleventy dev server:

```bash
npm install
npm start
```

Open <http://localhost:8080>.

## Install as web app

On supported Chromium browsers, install prompting is browser-managed and may
appear automatically after engagement heuristics are met. The site also exposes
an **Install as app** button when an install prompt event is available.

On iPhone/iPad (Safari), use **Share → Add to Home Screen**.

## Building

```bash
npm run build
```

Build output is written to `dist/`.
