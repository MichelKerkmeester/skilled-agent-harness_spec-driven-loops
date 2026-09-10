# Iteration 1: The contract and its checker

## Focus

Verify lineage `glm`'s iteration 1 (angle 1: the contract and its checker) against disk, then
deepen: whether any example carries a second `<svg>`, the exact assertion text/regex per family,
and per-file failure counts for all 34 examples (not samples).

## Verification of the first lineage

- F1.1 CONFIRMED — no HTML/SVG checker ships. `sk-design-diagram/scripts/` holds exactly
  `drawio_extract.py`, `mermaid_extract.py`, `validate-flowchart.sh` (ASCII-flowchart validator
  only; confirmed by directory listing). No `check*.cjs` or equivalent exists anywhere under the
  skill.
- F1.2 CONFIRMED exactly — `grep -c "tally('" check-corpus.cjs` = 75 call sites;
  `grep -o "tally('[^']*'" | sort -u | wc -l` = 47 distinct family names. Both numbers match
  glm's census precisely.
- F1.3 CONFIRMED, with a methodological trap reproduced and caught. A naive single-line
  `grep -E '<svg[^>]*role="img"'` over `example-loop-terminal.html` returns a false NO-MATCH,
  because the file's `<svg ...>` open tag spans lines 172-177 (one attribute per line) — the
  exact class of error the conductor's synthesis flagged in glm's own dispatch-fact correction.
  Flattening the file first (`tr -d '\n' | grep`) shows `role="img"` and
  `aria-labelledby="loop-terminal-title loop-terminal-desc"` are both present. Corpus-wide:
  `grep -L` for `role="img"` and for `aria-labelledby=` (both flatten-safe via file-level `-l`)
  return zero misses across the 34 examples. **34/34 holds.** Actionable for the family itself:
  any regex-based `accessible-svg` family MUST be authored against a flattened/`s`-flag view of
  the source, or it will silently fail files with multi-line opening tags — a defect class, not a
  one-off.
- F1.4 CONFIRMED exactly — `grep -L "fonts.googleapis.com"` across all 34 examples + 4 templates
  returns empty (38/38 hit). Extended below: `icons.html` also hits it (1 occurrence), a 39th file
  glm's "38" scope correctly excluded (it scoped to examples+templates, not the icon gallery).
- F1.5 CONFIRMED — `SKILL.md:337` ("Exempt: stroke widths, opacity, dot pattern, font sizes...")
  and `SKILL.md:403` ("every font size, coordinate, node dimension, and gap divisible by 4...")
  contradict at the same line numbers glm cited; the file has not moved. `example-flowchart.html`
  violations reproduce at the exact values cited — `y="230"` (rect, ~line 89), `y="239"` (text,
  ~90), `y="298"` (rect, ~96), `y="307"` (text, ~97) — none divisible by 4.
- F1.6 CORRECTED (citation, not substance) — **both cited line numbers are impossible.**
  `example-high-level.html` is 301 lines total; glm cited `:1382-1383`.
  `example-radar.html` is 139 lines total; glm cited `:3389-3392`. Neither file has ever had
  those line counts (no `.git` history shows a truncation of this magnitude for either file —
  these numbers were never real). The underlying *substance* holds on re-derivation: the radar
  spokes are real diagonal `<line>` elements at `example-radar.html:81-85`
  (`x1="500" y1="240" x2="652" y2="191"`, etc. — a genuine off-axis fan from the radar's center,
  legitimately not a "connector") and `example-high-level.html` does carry diagonal `<line>`s at
  `:264-265`, but they are strokes *inside* a nested, `aria-hidden="true"` icon glyph (a
  compass/settings icon, 0–24 local coordinate space) — decoration, not the connector layer. The
  finding's conclusion (orthogonal-only holds on the connector layer; radar spokes and icon
  strokes are legitimate non-connector diagonals) survives; the citations that supported it do
  not, and neither the brief nor the conductor's synthesis caught this. Recorded because a
  research run citing an evidence line that cannot exist is the same defect class this whole
  verification pass exists to catch.
- F1.7 CORRECTED (mechanical recount) — glm reported "11/34 define the trio, 23 fail" and flagged
  it as hand-counted, asking for a mechanical recount. Recounted via three `grep -l` file-list
  intersections (`id="arrow"` ∩ `id="arrow-accent"` ∩ `id="arrow-link"`): **10/34**, not 11/34.
  Files carrying all three: `architecture, dp-integration, import-drawio, it-state, loop,
  medallion, sequence-oauth-dark, sequence-oauth-full, sequence-oauth, sequence`. 24/34 fail, not
  23. `id="dots"` collision reconfirmed exactly at 26/34 (files without it:
  `dp-security-matrix, import-drawio, import-mermaid, it-state, org-chart, medallion,
  quadrant-consultant, venn`).
- F1.8 CORRECTED (markup-vs-node gap, quantified) — raw `<rect` count in `example-high-level.html`
  is **36**, not 29. The delta (7) is exactly the arrow-label mask rects (`rx="2"`, small
  `width="24-32" height="12"` boxes drawn behind label text, e.g. `:89,96` in the flowchart-style
  census above) plus the container/background rects — none of which are "nodes" in the budget
  sense. `#eb6c36` (accent) occurrence count reconfirmed exactly at **10**, matching glm. This
  sharpens rather than contradicts F1.8's own point: a raw element-count census overstates the
  node budget unless mask/background rects are excluded first — the markup convention F1.8 asks
  for must define "node rect" as a subset of `<rect>`, not all of it.
- F1.9 CORRECTED (mechanical recount) — `example-er.html` types **91** hex literals
  (`grep -oE '#[0-9a-fA-F]{6}' | wc -l`), not 88; the 4 `var(--color-*)` count is confirmed exact.
  `#3d4460` is confirmed to appear in exactly two files repo-wide
  (`type-high-level.md`, `example-high-level.html`) and nowhere in `foundations/style-guide.md`
  — F1.9's scope claim holds even though the example's own literal count was off by three.
- F1.10 CONFIRMED as reasonable synthesis — a summary judgment, not independently falsifiable
  the way a census is; no disk evidence contradicts it.

## Settled from "could not settle"

- "Whether the marker trio is unconditional or conditional on connectors existing" — STILL OPEN.
  Disk shows correlation, not a rule: all 10 trio-complete files also define real connector
  arrows; but so do 9 more of the 24 trio-incomplete files (e.g. `example-flowchart.html` has
  `id="arrow"` and `id="arrow-accent"` but not `id="arrow-link"` — it never draws a link-typed
  connector). The absence pattern is consistent with "define only the marker kinds you use," which
  is a *plausible* contract, but nothing on disk states it as a rule — this is a decision for P2,
  not a fact the disk can settle.
- "Page-vs-file uniqueness scope" — STILL OPEN, no new evidence; the diagram corpus has no
  multi-diagram-per-page composition today to test against.
- "Node/coral markup conventions" — STILL OPEN as a decision, but now quantified (see F1.8 above):
  the convention must exclude label-mask rects, and must resolve occurrence-vs-element for accent
  (confirmed both `#eb6c36` literal and `rgba(235,108,54,` spellings exist — see iteration 2).
- "The :403/:337 adjudication" — STILL OPEN (a P2 decision, not a disk fact).
- "Whether any example carries a second `<svg>`" — **SETTLED, and it's bigger than a yes/no.**
  See "What was extended" below.

## What was extended

1. **`example-high-level.html` carries 13 `<svg>` elements, not one.** The outer file-level `<svg>`
   (line ~1: `viewBox="0 0 1000 540" ... role="img" aria-labelledby="high-level-title
   high-level-desc"`) is the only accessible one; the other 12 are nested icon glyphs, each
   positioned with `x=`/`y=`/`width=`/`height=` attributes and each independently carrying
   `aria-hidden="true"`. Every nested `<svg>` was checked: none defines its own `<title>`, so a
   title-first regex anchored to the *first* `<svg role="img">` match (rather than the first
   `<svg` match unconditionally) is required — an unscoped "first `<svg>` tag" regex would still
   happen to work here because the outer svg IS the first `<svg` in document order, but that is
   this file's luck, not a guarantee the family can rely on for a future example that nests an
   icon before its own frame opens. This is the only example in the corpus with more than one
   `<svg>` — every other file returns `<svg count>` = 1 via `grep -c '<svg'`.
2. **Exact assertion text for the two families most directly portable, taken verbatim from
   `check-corpus.cjs`:**
   - `accessibility` (`:1000-1011`): tests `role="img"` via `/\brole\s*=\s*"img"/i.test(openTag)`
     against the matched `<svg ...>` open-tag capture (not a raw substring search over the file),
     error text *"an `<svg>` carries no `role="img"`. A screen reader gets nothing from an
     unlabelled drawing"*; then `/\baria-labelledby\s*=\s*"([^"]+)"/i`, error *"an `<svg>` carries
     no aria-labelledby"*; then resolves every space-separated id in that attribute against the
     file's known id set, error *"aria-labelledby points at "${ref}", which no element in this
     file defines"*. The diagram family needs the identical three-part shape (attribute-presence
     ×2 + reference-resolution), plus a fourth check the chart doesn't need (title-first-child)
     since the chart has no `<title>` positional contract.
   - `no-external` (`:918-945`): a `patterns` array of `[regex, description]` pairs tested against
     `stripHtmlComments(src)` (comments are stripped FIRST, specifically because "a sentence
     naming a remote font to warn an author off one is not a remote font" — the diagram's own
     `style-guide.md:50` note about examples being "built under an earlier skin" is exactly this
     kind of prose that a naive substring scan would misfire on); then a second pass extracts
     `url(...)` targets from `<style>`/`<script>` regions and flags any non-`#`/non-`data:` target,
     error *"url("${target}") names a resource this file does not carry... What the file needs, it
     holds."* The diagram's one violation (`fonts.googleapis.com`, via `<link>`, not `url()`) needs
     a THIRD check the chart's version doesn't carry: a `<link rel="stylesheet" href="...">` scan,
     since Google Fonts is loaded as a `<link>`, not a CSS `url()`.
3. **Per-file failure counts for all 34, not samples, for every angle-1 family:**
   | Family | Assertion | Pass | Fail (exact files) |
   |---|---|---|---|
   | accessible-svg (role+labelledby+title-first) | see above | 34/34 | none |
   | no-external (fonts.googleapis.com) | link href match | 0/34 | all 34 (+4 templates +icons.html = 39) |
   | marker-trio (arrow+arrow-accent+arrow-link) | id triple-presence | 10/34 | 24: every file not in the F1.7 list above |
   | id-uniqueness (`id="dots"` collision) | unprefixed id reuse | 8/34 clean | 26: every file not in the F1.7 "absent" list |
   | 4px-grid (flowchart sample only; full 34-file census deferred to angle-2/token work) | coordinate % 4 | not run corpus-wide this iteration | `example-flowchart.html` confirmed failing |
4. **A second, unflagged self-contained leak**: `icons.html` independently loads
   `fonts.googleapis.com` (`grep -c` = 1) even though it carries no diagram content and is never
   screenshotted (checked in iteration 4). If "self-contained" becomes a checked family, its file
   scope needs an explicit decision on whether `icons.html` is in-corpus or exempt — right now it
   is neither ruled in nor out by anything on disk.

## Recommendations

1. [needs a contract decision] Marker vocabulary: freeze the trio at 10/34's shape and decide
   whether "define only the kinds you draw" is the rule (disk supports it, doesn't prove it) —
   corrected count changes nothing about the shape of the decision, only its magnitude (24 fail,
   not 23).
2. [needs a contract decision] Adjudicate `:403` vs `:337`; the flowchart's specific violations
   are text-baseline offsets derived from their rect's `y + 9` for vertical centering, not freely
   chosen coordinates — worth naming as its own exemption clause ("derived label-offset
   positions") rather than folding into the general font-size exemption, since it's a distinct
   mechanism.
3. [implementable today] Author the accessibility family test against a flattened/`s`-flag view of
   the source, not line-oriented text — `example-loop-terminal.html`'s multi-line open tag proves
   naive line-based regex silently false-negatives here, and a future example is free to wrap its
   tag the same way.
4. [implementable today] Scope the title-first rule to "the first `<svg>` carrying `role="img"`,"
   not "the first `<svg>` in the document" — `example-high-level.html`'s 12 nested icon `<svg>`s
   happen not to break an unscoped rule today only because none of them precedes the frame's own
   opening tag.
5. [needs a contract decision] Define "node rect" as a markup-tagged subset of `<rect>` before any
   budget family — the raw-vs-node gap is now quantified at 7 elements in one file alone
   (36 raw, 29 by whatever convention glm's "node" count implicitly used).
6. [needs a contract decision] Self-contained family file scope: decide whether `icons.html` is
   in-corpus (currently: undecided, and it independently fails the same no-external assertion).

## What this iteration could not settle

- A full 34-file 4px-grid census (only the flowchart sample was reproduced this iteration;
  corpus-wide coordinates-mod-4 census is carried into iteration 2's token/value work, where the
  full literal census is being built anyway).
- Whether other line-number citations across glm's remaining four iterations share the same
  fabrication risk found in F1.6 — flagged for spot-checking in iterations 2-5 rather than a full
  audit of all ~120 citations, which would exceed this iteration's scope.
- Whether "define only the marker kinds you draw" is the intended rule or an accident of which
  examples happen to need which connector types — a P2 decision, not a disk fact.
