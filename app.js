/**
 * Can Alexa Eat That? — search logic
 *
 * Data is loaded from data/WHITELIST.txt and data/BLACKLIST.txt.
 */

const DATA_FILES = {
  allowed: "data/WHITELIST.txt",
  denied: "data/BLACKLIST.txt",
};

const SIMILARITY_THRESHOLD = 0.6;

// ---------------------------------------------------------------------------
// Data loading & parsing
// ---------------------------------------------------------------------------

async function fetchText(url) {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.text();
  } catch (err) { /* network or CORS error */ }
  return '';
}

/**
 * Parse a TXT list.
 * Each non-empty line: "Item Name: short description"
 */
function parseList(text, status) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'))
    .map(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) return { name: line, description: '', status };
      return {
        name:        line.slice(0, colonIdx).trim(),
        description: line.slice(colonIdx + 1).trim(),
        status,
      };
    });
}

// ---------------------------------------------------------------------------
// Fuzzy matching — Levenshtein similarity
// ---------------------------------------------------------------------------

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  // Use two-row rolling array for memory efficiency
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function similarity(a, b) {
  if (!a || !b) return 0;
  const dist = levenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

/**
 * Score how well `query` matches `item`.
 * Strategy (highest wins):
 *   1. Item name contains query as a substring → 1.0
 *   2. Query contains item name as a substring → 0.95
 *   3. Best word-level similarity across (query words × item words)
 *   4. Whole-string similarity as a floor
 */
function scoreItem(query, item) {
  const q = query.toLowerCase().trim();
  const name = item.name.toLowerCase();

  if (name.includes(q)) return 1.0;
  if (q.includes(name)) return 0.95;

  const qWords = q.split(/\s+/);
  const nWords = name.split(/\s+/);

  let best = similarity(q, name);

  for (const qw of qWords) {
    for (const nw of nWords) {
      const s = similarity(qw, nw);
      if (s > best) best = s;
    }
  }

  return best;
}

// ---------------------------------------------------------------------------
// All-items list (alphabetized, icon + name only)
// ---------------------------------------------------------------------------

function renderAllItems(items) {
  const section = document.getElementById('all-items');
  const sorted = [...items].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );

  section.innerHTML = '';

  const heading = document.createElement('p');
  heading.className = 'all-items-heading';
  heading.textContent = 'All items';
  section.appendChild(heading);

  const ul = document.createElement('ul');
  ul.className = 'all-items-list';
  for (const item of sorted) {
    const li = document.createElement('li');
    const iconSpan = document.createElement('span');
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.textContent = item.status === 'allowed' ? '✅' : '❌';
    li.appendChild(iconSpan);
    li.appendChild(document.createTextNode(item.name));
    ul.appendChild(li);
  }
  section.appendChild(ul);
}

// ---------------------------------------------------------------------------
// UI rendering
// ---------------------------------------------------------------------------

function renderResults(matches) {
  const list = document.getElementById('results');
  list.innerHTML = '';

  if (matches.length === 0) {
    const li = document.createElement('li');
    li.className = 'no-results';
    li.textContent = 'No matches found — try a different spelling.';
    list.appendChild(li);
    return;
  }

  for (const { item } of matches) {
    const li = document.createElement('li');
    li.className = item.status;   // 'allowed' | 'denied'

    const icon   = item.status === 'allowed' ? '✅' : '❌';
    const verdict = item.status === 'allowed' ? 'Alexa CAN eat this' : 'Alexa CANNOT eat this';

    li.innerHTML = `
      <span class="result-icon" aria-hidden="true">${icon}</span>
      <div class="result-body">
        <div class="result-name">${escapeHtml(item.name)}</div>
        <div class="result-desc">${escapeHtml(item.description)}</div>
        <div class="result-verdict">${verdict}</div>
      </div>`;

    list.appendChild(li);
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

function search(query, items) {
  if (!query.trim()) return [];

  return items
    .map(item => ({ item, score: scoreItem(query, item) }))
    .filter(({ score }) => score >= SIMILARITY_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

(async function init() {
  const [whiteText, blackText] = await Promise.all([
    fetchText(DATA_FILES.allowed),
    fetchText(DATA_FILES.denied),
  ]);

  const items = [
    ...parseList(whiteText, 'allowed'),
    ...parseList(blackText, 'denied'),
  ];

  const input = document.getElementById('search');
  const allSect = document.getElementById('all-items');

  renderAllItems(items);

  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (query) {
      allSect.hidden = true;
      renderResults(search(query, items));
    } else {
      allSect.hidden = false;
      document.getElementById('results').innerHTML = '';
    }
  });
})();
