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

Because the site uses `fetch()` to load the TXT files, you need a local HTTP
server (opening `index.html` directly via `file://` will not work for most
browsers due to CORS restrictions).

```bash
# Python 3 — serve the whole repo from its root
python3 -m http.server 8080
# then open http://localhost:8080/src/
```

## Deploying

The `src/` directory is the deployable unit.  Copy (or symlink) `WHITELIST.txt`
and `BLACKLIST.txt` into `src/` before deploying if your host only serves from
one directory, then update the `DATA_FILES` paths in `src/app.js` to `./`.

For **GitHub Pages** the easiest option is to configure Pages to serve from
the repo root and navigate to `/src/`.
