---
title: Refero style-library extractor
description: A resumable Node harness that enumerates the styles.refero.design sitemap and captures each style's four Extended tabs into the sk-design token library via the Chrome DevTools MCP.
trigger_phrases:
  - "refero extraction harness"
  - "styles library extractor"
  - "refero sitemap crawler"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Refero style-library extractor

## Overview

`extract-refero.mjs` builds the sibling `styles/<slug>/` folders from
[styles.refero.design](https://styles.refero.design/). For each `/style/<uuid>`
page it captures the four published tabs — **DESIGN.md, Tailwind v4, CSS
Variables, Design Tokens** (the Extended variant) — verbatim, and writes one
folder per style plus a `source.md` that links back to the original style.

The tabs are client-rendered, so they are read from a real Chrome through the
Chrome DevTools MCP server; the per-style canonical provenance JSON is parsed
from the same page's embedded flight data over a plain HTTPS GET. The crawl is
idempotent and resumable via a lastmod-keyed manifest, and throttled to one page
at a time because the site's `robots.txt` bans AI-crawler agents (the operator
authorized a throttled capture of these public pages; `/api/` is never touched).

## Architecture

```text
╭──────────────────────────────────────────────────────────────────╮
│                    extract-refero.mjs (host)                      │
╰──────────────────────────────────────────────────────────────────╯

  sitemap ──▶ enumerate() ──▶ _manifest.json  (uuid, lastmod, status)
                                   │
                                   ▼  per pending/stale/error row
     ┌───────────────────────────────────────────────────────────┐
     │ HTTPS GET (browser UA) ──▶ parseCanonical()  → <slug>-canonical.json
     │ chrome-devtools-mcp     ──▶ captureTabs()    → the four Extended tabs
     └───────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                    writeStyle()  → styles/<slug>/{4 tabs, canonical, source.md}

Boundary: Node owns enumeration, throttle, resume, parsing, and all file
writes; the browser (chrome-devtools-mcp, spawned over stdio) only reads DOM.
```

## Directory tree

```text
_harness/
├── extract-refero.mjs   # the extractor (this folder's only executable)
└── README.md            # this file
../_manifest.json        # crawl state, written per style
../<slug>/               # one folder per captured style (see Output below)
```

## Key files

| File | Role |
|------|------|
| `extract-refero.mjs` | Enumerate → capture → write, with throttle, lastmod resume, `--self-test`, and `--normalize`. |
| `../_manifest.json` | Crawl state: `{ uuid, url, lastmod, slug, status, capturedAt, error }` per style. |

## Output (per style)

```text
../<slug>/
  DESIGN.md  css-variables.css  tailwind-v4.css  design-tokens.json   # the four Extended tabs
  <slug>-canonical.json                                               # raw provenance
  source.md                                                           # link back to the Refero style + original site + preview
```

## Entrypoints

```bash
node extract-refero.mjs --enumerate-only     # refresh _manifest.json from the sitemap, capture nothing
node extract-refero.mjs --self-test          # re-capture cursor and byte-diff vs ../cursor/ (writes nothing real)
node extract-refero.mjs --limit 50           # capture up to 50 not-yet-done styles
node extract-refero.mjs --only <uuid|slug>   # (re)capture a single style
node extract-refero.mjs --normalize          # migrate existing folders to the current shape
node extract-refero.mjs                      # capture ALL remaining pending/stale/error styles
```

Flags: `--delay-ms 2000` (inter-page delay), `--page-timeout-ms 60000`, `--dry-run`.

### Resume & idempotency

The manifest is written after every style. A row's `status` is `pending → captured`
on success or `error` on failure; a captured row whose sitemap `lastmod` later
changes flips to `stale`. A run only processes `pending`/`stale`/`error` rows, so
re-running is a no-op over already-captured, unchanged styles and retries failures.

## Validation

```bash
node extract-refero.mjs --self-test          # expect: MATCH ×4 then PASS
```

The self-test re-captures the cursor style and byte-diffs the four Extended tabs
against the committed [`../cursor/`](../cursor/) reference (timestamp-normalized),
without writing to any real style folder. Raise `--delay-ms` if the site returns 429s.

## Related

- [`../cursor/`](../cursor/) — the reference style; the output template every capture mirrors.
- [`../README.md`](../README.md) — the extracted-styles index.
- `.opencode/specs/sk-design/010-sk-design-styles-from-refero/` — the spec packet (harness + pilot phases).
