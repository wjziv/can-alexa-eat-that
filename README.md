# Can Alexa Eat That?

A front-end-only static website that lets friends quickly look up what Alexa
can and can't eat, powered by a simple fuzzy-search over two plain-text lists.

## Repository layout

```
WHITELIST.txt   ← master list of allowed foods (candies / safe items)
BLACKLIST.txt   ← master list of denied foods  (vegetables / unsafe items)
src/
  index.html    ← single-page UI
  style.css     ← minimal styles
  app.js        ← data loading, Levenshtein fuzzy-search, rendering
```

## Editing the lists

Each file follows a simple line format:

```
Item Name: short, helpful description
```

Add or remove lines in `WHITELIST.txt` or `BLACKLIST.txt` — the site picks up
the changes automatically on next load.

## Running locally

Install dependencies and run the Eleventy dev server:

```bash
npm install
npm start
```

Open <http://localhost:8080>.

## Building

```bash
npm run build
```

Build output is written to `dist/`.
