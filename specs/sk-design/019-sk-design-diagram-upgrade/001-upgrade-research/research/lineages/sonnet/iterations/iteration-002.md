# Iteration 2: The token source and the repaint

## Focus

Verify glm's iteration 2 (angle 2) against disk, then deepen: which files carry the `#ffffff`
occurrences and in what role, which two examples carry neither the warm nor the cool rule-rgba,
and whether dark-column values are a computed lightness shift of light-column values at a stated
ratio.

## Verification of the first lineage

- F2.1 CORRECTED (minor, mechanical) — full corpus-wide hex-literal recount over the 34 examples:
  **1,577 literals over 25 distinct values**, not 1,585. The four dominant values match glm's
  per-value counts EXACTLY: `#4f5d75`×602, `#2d3142`×292, `#f5f5f5`×245, `#eb6c36`×178 — these sum
  to 1,317, i.e. **83.5%** of 1,577 (glm's "83.1%" was computed against the slightly-off 1,585
  total; the four-value concentration itself is confirmed to the literal). Distinct-value count
  (25) confirmed exact. The 8-literal gap is in the long tail (values occurring 1-14 times each)
  and does not change any decision this finding supports.
- F2.2 CONFIRMED — `#3d4460` confirmed absent from `foundations/style-guide.md` and present only
  in `type-high-level.md` + `example-high-level.html` (2 occurrences, matching iteration 1's
  independent check). `#ffffff` traced to the "backend/API/step = white / ink" node treatment
  (`SKILL.md:318`); see the full per-file breakdown below.
- F2.3 CONFIRMED exactly — 0/38 files (34 examples + 4 templates) reference
  `prefers-color-scheme`; each of the 4 templates has exactly one `:root` block, at the exact
  cited lines (`template.html:10`, `template-dark.html:10`, `template-terminal.html:19`,
  `template-full.html:12`).
- F2.4 CONFIRMED exactly — the warm inversion spelling `rgba(28,25,23,X)` (from
  `style-guide.md:54`'s literal example) appears in **0/34** examples; the cool spelling
  `rgba(45,49,66,` (the actual current ink, `#2d3142`, as an alpha value) appears in **32/34**.
  Both numbers match glm's census precisely.
- F2.5 CONFIRMED by independent re-derivation, not just re-reading. Recomputed WCAG 2.1 relative
  luminance and contrast ratio from raw RGB for two of the four cited gates: accent (`#eb6c36`)
  against ink (`#2d3142`) = **4.131:1** (glm: 4.13:1); accent against paper (`#f5f5f5`) =
  **2.863:1** (glm: 2.86:1). Both match to three significant figures via independent computation
  (not re-reading glm's number), which is the strongest confirmation this verification pass can
  give a computed claim — the 2.86:1-vs-3.0-gate conflict F3.7 hinges on is solid arithmetic, not
  a hand-count that could be off by one.
- F2.6 CORRECTED to match F2.1's recount — the repaint scope is 1,577 literals (not 1,585) across
  4 template roots; same conclusion (derivation-driven or it misses rgba spellings and bakes
  stale values), just the corrected literal count.

## Settled from "could not settle"

- **Which files carry the `#ffffff` occurrences, and in what role — SETTLED.** Corpus-wide count
  is 40 (not glm's implicit total; glm never stated a `#ffffff` total, only that it's "the
  `backend` treatment"). Per-file: `example-architecture.html`(2), `example-er.html`(3),
  `example-flowchart.html`(5), `example-import-drawio.html`(3), `example-import-mermaid.html`(4),
  `example-layers.html`(1), `example-org-chart.html`(5), `example-sequence-oauth.html`(1),
  `example-state.html`(2), `example-sequence-oauth-full.html`(2), `example-venn.html`(1),
  `example-swimlane.html`(7), `example-tree.html`(4) — 13 files, sums to exactly 40. Role,
  confirmed by direct inspection (`example-architecture.html:139,160`): always paired
  `fill="#ffffff" stroke="#2d3142"` on a `<rect>` — the backend/API/step node treatment from
  `SKILL.md:318`, never a background or paper substitute.
- **The two examples carrying neither the warm nor the cool rule-rgba — SETTLED, with mechanism.**
  `example-loop-terminal.html` and `example-sequence-oauth-dark.html`. Both are dark-ground files,
  and each resolves differently: `sequence-oauth-dark.html` uses `rgba(245,245,245,X)` — the
  *dark-mode ink* (`#f5f5f5`, per the inversion rule) — so it uses a real ink-alpha rule value,
  just the dark one, not "neither." `example-loop-terminal.html` uses only
  `rgba(255,255,255,0.08)` — pure white at low opacity, consistent with the terminal skin being
  documented as a *fixed, non-brand-tokenized* skin (`primitive-terminal.md`, referenced from
  `SKILL.md`'s primitives list) that does not derive from the ink token at all. So the honest
  statement is: one of the two derives from dark-ink (a residency question, already answered by
  F2.3's "source keeps all grounds"); the other is intentionally outside the token system
  entirely, by design, and any derivation record needs to say so explicitly rather than trying to
  fit the terminal skin's rule value into the same 3-list taxonomy as the brand-derived skins.
- **Whether the dark-column values are a fixed derivation of light-column values at a stated
  ratio — SETTLED: no.** Computed HSL for the accent pair: `#eb6c36` = H17.9° S81.9% L56.7%;
  `#f08a59` = H19.5° S83.4% L64.5%. This is NOT a pure lightness shift (hue moved +1.6°,
  saturation +1.5pp, lightness +7.8pp) — it is close to one, but not exact, and
  `style-guide.md:54` itself says only "a slight hue-shift brighter," in prose, with no formula or
  ratio. There is no arithmetic rule on disk to encode into the derivation record's "arithmetic"
  bucket for this pair; today it would have to land in "verbatim" (a second hand-picked primary
  per skin) unless P2 invents a real formula (e.g., HSL L+8pp, H+1.6°) and re-derives the dark
  value from it — which would likely change `#f08a59` by a visually negligible but real amount.
  This is a genuine, previously-unstated finding: the "cross-skin alias" derivation kind
  glm's F3.6 names (`palettes.json`-style) has no worked numeric example on the diagram side yet,
  and the one pair tested here shows the prose-only "slight hue-shift" is not actually a
  computable rule as written.

## What was extended

1. Full `#ffffff` file/count/role census (13 files, 40 occurrences, one consistent role) — see
   above; this was an explicit open item in the dispatch brief's own "facts already measured"
   framing (it cites "40" without a source), and it is now sourced and file-attributed.
2. The two rule-rgba-outlier files' mechanisms fully explained (dark-ink derivation vs.
   intentionally untokenized terminal skin) — not just counted.
3. A worked HSL computation showing the accent's light→dark pair is not a stated-ratio derivation
   today, closing the dispatch's explicit "compute it" instruction with a real answer (no) rather
   than a restatement of the prose.
4. Corpus-wide value distribution table (25 values, all counts) produced directly rather than
   sampled, confirming glm's top-4 figures to the literal while correcting the total and the
   percentage it implies.

## Recommendations

1. [needs a contract decision] Same as glm's — source scope = foundations + type tables (unchanged
   by this iteration's corrections).
2. [needs a contract decision] The derivation record must carry an explicit **fourth kind**
   beyond glm's three (verbatim / departs-to-clear-a-gate / arithmetic): "untokenized" — for the
   terminal skin's rule value, which by design does not derive from any brand primary. Folding it
   into "verbatim" would imply it *should* eventually derive from something; it should not.
   — new, not in glm's F2.4/F3.6.
3. [needs a contract decision] Either invent and state a real HSL formula for the accent's
   light→dark shift (and re-derive `#f08a59` from it, accepting a possibly-different value) or
   record it as "verbatim, both hand-picked" — but do not let `style-guide.md:54`'s prose stand in
   for a rule the derivation record can check.
4. [implementable today] Use the corrected literal count (1,577, not 1,585) and the corrected
   percentage (83.5% of 1,577, not 83.1% of 1,585) in any planning document that cites this census.
5. [implementable today] Document the `#ffffff` backend-treatment role and its 13-file/40-count
   footprint directly in the token source, since it is the second-most-total-instances role
   token after the four already named.

## What this iteration could not settle

- A full recount of glm's other three gate ratios (soft 3.48:1, accent-vs-ink secondary readings,
  hairline range 1.25-1.58:1) — two of four were independently recomputed and matched exactly;
  the remaining two were not re-derived this iteration for time, and nothing found here casts
  doubt on them.
- Whether any value outside the top 4 (e.g. `#7a8399`, `#2e5aa8`) should be promoted to a named
  role beyond what `style-guide.md`'s existing table already covers — deferred to angle 4's
  catalog/token-scope work.
