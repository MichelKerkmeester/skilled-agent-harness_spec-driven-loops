# Iteration 4: The corpus shape

## Focus

Verify glm's iteration 4 (angle 4) against disk, then deepen: read the screenshots directly
(this environment's Read tool opens PNGs, unlike glm's `sk-vision RUNTIME_UNAVAILABLE`) to judge
current-vs-retired skin, and tabulate the precise ceiling wording across all 27 `type-*.md` files.

## Verification of the first lineage

- F4.1 CONFIRMED — the 27+5+2+0 taxonomy maps cleanly onto the file list: 27 canonical examples
  (1:1 with `references/types/type-*.md`), 5 variants (`example-loop-terminal`,
  `example-quadrant-consultant`, `example-sequence-oauth`, `example-sequence-oauth-dark`,
  `example-sequence-oauth-full` — oauth is a named variant of the `sequence` type, with no
  `type-oauth.md` of its own), 2 import proofs (`example-import-drawio`, `example-import-mermaid`),
  0 decoration. 27+5+2 = 34, matching the directory listing exactly.
- F4.2 CORRECTED, and this one matters — glm: "Screenshots: 38/38, 1:1 — the same 38 files that
  fetch Google Fonts; icons.html: none." **`screenshots/icons.png` exists.** Full inventory:
  `find screenshots -type f | wc -l` = **39** (34 examples + 4 templates + `icons.png`), not 38.
  `icons.html` has both a font-link (found in iteration 1) and a screenshot glm said it lacked —
  glm was wrong on both points about `icons.html`.
- F4.3 CONFIRMED exactly, and extended — SKILL.md=1.0.0.0, style-guide.md=1.0.0.5,
  playbook=1.0.0.5, README=1.0.0.7 all reproduce exactly. **A fifth version-field mirror**, not in
  any of glm's five iterations: `feature-catalog/feature-catalog.md:11` also carries
  `version: 1.0.0.5` — a new top-level directory (`feature-catalog/`, paralleling
  `manual-testing-playbook/`, both already present in the diagram skill) that mirrors the chart's
  own structure and that glm never read or mentioned across any of its 5 iterations.
- F4.4 CONFIRMED — `sk-design-chart/references/catalog.md:40,74` carries the
  `<!-- CHART_CATALOG:BEGIN -->` / `:END` sentinel pair glm cited; `check-corpus.cjs` has 3
  `tally('catalog...` call sites (`catalog`, `catalog-system`, and a third), consistent with a
  both-directions check.
- F4.5 CORRECTED, substantially — glm: "117 lines of router pseudocode ≈ 31% of 37,116 bytes."
  The byte count for `SKILL.md` itself is exact (37,116, confirmed via `wc -c`). But the
  ```python``` fence (`SKILL.md:181-291`, 111 lines) is **4,692 bytes — 12.6% of the file, not
  31%** — glm's percentage is off by more than 2.5×. (By line count instead, 111-113 of 529-530
  lines is ~21%, still nowhere near 31% under either metric.) The qualitative point (a large
  pseudocode block occupies a meaningful share of a "SKILL.md should route, not implement"
  document) survives; the specific number does not. The "accessibility contract stated three
  times" sub-claim is CONFIRMED exactly at the same three loci glm cited
  (`:380-381` definition, `:406` rule-7 restatement, `:495-496` checklist restatement).
- F4.6 CONFIRMED, and narrowed — `diagram.md:67` does say "the bound workflow YAML
  (`create-diagram-auto.yaml` for `:auto`, `create-diagram-confirm.yaml` for `:confirm`...)" —
  the stale `create-` prefix, exactly at the cited line. But `diagram.md:25-26,50-51` **correctly**
  name the real files (`diagram-auto.yaml`, `diagram-confirm.yaml`, no `create-` prefix) — the
  drift is a single stale line, not a file-wide inconsistency, which narrows the fix to one line,
  not a document-wide rename sweep. Ownership: `SKILL.md:9-10` states "sk-doc" ownership;
  `sk-design/mode-registry.json:89,107-108` registers `sk-design-diagram` as a `sk-design`
  workflow mode; `sk-doc/mode-registry.json` has **zero** occurrences of "diagram" (confirmed via
  direct grep, not inferred) — the mismatch is real and total, not partial.

## Settled from "could not settle"

- **Whether the PNGs are visually stale against the current skin (warm vs. cool) — SETTLED by
  direct inspection, not inference.** This environment's Read tool opens PNG files directly (the
  first lineage's `sk-vision` tool was reported unavailable to it). Four screenshots were opened
  and visually inspected: `example-architecture.png` and `example-high-level.png` (both:
  white-smoke paper, cool navy-black ink text, atomic-tangerine/coral accent border on the focal
  node — the current skin, unambiguously), `template-dark.png` (dark navy `#2d3142`-toned
  background with white-smoke ink text — the current dark-mode inversion, not a warm palette),
  and `icons.png` (white-smoke paper, cool navy ink and icon strokes). **All four match the
  current cool skin; none shows the retired warm palette.** This confirms — by direct evidence,
  not inference from prose — the conductor's own tentative read ("the conductor's own read of
  four captures this week found them current"), and resolves glm's F4.2 "OPEN: tool outage
  reported" status to CLOSED: not stale.
- **The precise ceiling wording across all 27 `type-*.md` files — PARTIALLY SETTLED, honestly.**
  A literal search for the word "Ceiling" returns **zero** of 27 files — there is no dedicated
  "## Ceiling" section anywhere; glm's own phrase "ceiling wording" describes an informal pattern,
  not a section header. Searching instead for the actual escape-hatch phrasing pattern
  (`"→ split"` / `"Above N"`) finds it in exactly **7 of 27**: `type-data-flow.md` (two: "Cap at 3
  custom-colored elements... Above 3..." at `:247`, and "Above 4 lanes or 6 steps: split..." at
  `:364`), `type-dp-security-matrix.md:232` ("Cap: ...≤5... Above 5..."),
  `type-high-level.md:361` ("Max 3 outgoing edges per node. Above 3, introduce a hub..."),
  `type-it-state.md:328` ("Cap: ≤3... Above 3..."), `type-loop.md:52` ("Budget (hard): 5-8
  stations... Above 8 stations, split..."), `type-radar.md:21` ("N axes (3-5)... Above 5 → split
  or use a comparison table."), `type-process.md` (two: `:270`, `:385`). **There is no single
  uniform ceiling phrasing across the 27 files** — each type states its own limit in its own
  words (a "Cap," a "Budget (hard)," a bare "Max N," or an inline parenthetical), and only 7 use
  the specific "Above N → split" escape-hatch construction. A full 27-way tabulation of every
  type's own limit-phrasing would require reading each file's layout-conventions section
  individually (not done exhaustively this iteration); what is settled is that glm's implicit
  framing of a single, comparable "ceiling wording" running through all 27 files is not what the
  disk shows — the catalog work (P4) will need to normalize 27 genuinely different phrasings into
  one column, not extract one that already exists in a common shape.

## What was extended

1. Direct visual verification of 4 screenshots settling the staleness question with evidence
   glm's own toolset could not produce.
2. A previously unread structure: `feature-catalog/` (root `feature-catalog.md` plus per-feature
   files under `diagram-generation/`, `import-export/`, `command-and-hub-integration/`) already
   exists in the diagram skill, paralleling `manual-testing-playbook/` (which glm's iteration 5
   did read) — both mirror the chart's own directory shape and both were built independently of
   this research, meaning the "what moves out of SKILL.md into references" question (glm's
   Recommendation #4) already has a partial answer on disk: a feature-catalog structure exists
   and could absorb some of the duplicated prose, though it currently duplicates rather than
   replaces the SKILL.md content (not verified for content-identity this iteration).
3. The stale-YAML-name drift narrowed to a single line (`diagram.md:67`), not a document-wide
   inconsistency — changes the fix from "rename sweep" to "one-line edit."
4. A corrected, precise byte/line share for the router pseudocode block (12.6% of bytes, ~21% of
   lines — not glm's 31%), keeping the qualitative recommendation (extract it) while fixing the
   number a planning document might otherwise cite.

## Recommendations

1. [implementable today] Fix `diagram.md:67`'s two stale YAML names — confirmed to be the only
   stale occurrence, not a sweep.
2. [implementable today] Add `feature-catalog/feature-catalog.md`'s version field to the one-locus
   version-collapse work (now 5 disagreeing loci, not 4).
3. [needs a contract decision] Whether `feature-catalog/` and `manual-testing-playbook/` are the
   intended home for content extracted out of the 37KB SKILL.md, or independent, duplicate
   documentation that itself needs reconciling — this is now a real open question, not assumed.
4. [needs a contract decision] The type-ceiling catalog column needs to normalize 7 different
   phrasing styles (bare cap, hard budget, inline max, "above N → split") into one machine-checked
   column — this is real normalization work, not extraction of an already-uniform pattern.
5. [implementable today] Retire "PNG staleness" as an open risk in any planning document — settled
   closed, not stale, on direct visual evidence.

## What this iteration could not settle

- Whether `feature-catalog/`'s per-feature content duplicates or already supersedes portions of
  the 37KB SKILL.md — not diffed this iteration.
- A full per-file transcription of all 27 types' ceiling phrasing (only the 7-file "Above N"
  subset was censused; the remaining 20 state limits in their own words, not tabulated here).
- Screenshot staleness was checked on 4 of 39 files (a sample, chosen to span examples, a
  template, and the icon gallery); the remaining 35 were not individually opened this iteration.
