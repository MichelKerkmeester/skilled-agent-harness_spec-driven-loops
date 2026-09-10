# Deep Research Strategy — sk-design-diagram upgrade to the sk-design-chart standard

## Research Topic

How `sk-design-diagram` should be upgraded to the standard `sk-design-chart` now holds — the
same features where they transfer, adapted where the diagram context differs (a skinnable
editorial system chosen per deliverable, 27 types, SVG connectors, no data block). Evidence,
not preference. Five angles, one per iteration, in order; no early convergence.

## Known Context

- Standard: `.opencode/skills/sk-design/sk-design-chart/` — SKILL.md, references
  (template-contract, color-system, catalog, design-md-theming), 29 templates (light+dark blocks),
  `assets/color/palettes.json` (10,867B: note, chrome/chromeDark + role prose, radius ladder,
  typeScale, gates :65-76 with the `ungated` doctrine, systems :77, derivation :138-152 with the
  3-list taxonomy + reference+sha256), one carried Style Reference (origin.md, hash-pinned),
  `scripts/check-corpus.cjs`, mutation tests (84), `scripts/apply-design-md.cjs` (local-DESIGN.md
  only :158-159, gates-at-apply, copies-to--out :668, checker imports it :688), changelog
  v1.9.0.0-v2.5.0.0, CI gating on `RESULT: PASSED`.
- Subject: `.opencode/skills/sk-design/sk-design-diagram/` — SKILL.md (37KB), README.md,
  foundations/style-guide.md, 27 type-*.md, 4 skin templates, 34 examples, icons.html, 3 scripts
  (ASCII-only validation), no HTML/SVG checker, no test suite. Command: diagram.md + YAMLs.
- Run 1 (checker): F1.1-F1.10 — checker gap; family semantics; accessible-SVG holds 34/34;
  no-external 38/38 (fonts, one host); 4px fails + :403/:337 contradiction; orthogonal needs a
  type allowlist; marker trio 11/34 + unprefixed ids; budget semantics; token-source scope; what
  cannot be held.
- Run 2 (tokens): F2.1-F2.6 — 25 values / 1,585 literals (83.1% four); foundations 24/25,
  references 25/25; keep 1-skin-per-file (dual-block does not transfer); derivation scattered,
  :56 warm 0/34 vs cool 32/34; gates computed (soft 3.48:1, accent 2.86:1, accent-vs-ink 4.13:1,
  hairlines 1.25-1.58); repaint = 1,585 + 4 roots = the :52 "v5.1" debt.
- Run 3 (theming/fonts): F3.1-F3.7 — two documented self-contained bars (README:23,117 vs
  check:918-945); the chart's families-WITH-fallbacks vs the diagram's none (port the chains);
  the trio is load-bearing (onboarding:87,139); BOTH — keep onboarding, add the applicator as a
  third hand-run script (input = the token source; --default = stock-exact = mechanized :311
  detection); NO second carried reference — inherit the pin discipline (derivation carries
  reference+sha256, palettes.json:142-143); derivation = 3 lists + kinds + tolerances; the
  emphasis conflict (accent 2.86 < the standard 3.0) = a departs row or a re-derivation; the
  `ungated` doctrine covers the hairlines.
- resource-map.md not present at init; skipping coverage gate (lineage-scoped artifact dir).

## Key Questions

- Q1: Which diagram rules can a regex-over-SVG family hold, which example fails each today, and
  what cannot be held statically? (Angle 1) — ANSWERED run 1
- Q2: What token source replaces the ~25 typed hex values, how do the three skins live in one
  source, and what would a by-value repaint change or break? (Angle 2) — ANSWERED run 2
- Q3: Does the diagram skill take a carried style reference + applicator, keep onboarding, or
  both — what would palette-derivation mean here — and does it keep Google Fonts? (Angle 3) —
  ANSWERED run 3
- Q4: What is the right template/example/catalog split for 27 diagram types, what leaves the
  37KB SKILL.md, and what happens to the command and its stale names? (Angle 4)
- Q5: How do the mutation suite, the CI gate, and a fresh-reader capture review adapt to
  diagrams — and what are the phases after this one? (Angle 5)

## Answered Questions

- Q1 (run 1): iteration-001.md findings 1-10.
- Q2 (run 2): iteration-002.md findings 1-6.
- Q3 (run 3): iteration-003.md findings 1-7. Both: onboarding (extraction) stays, the applicator
  (application) is added — the standard's own division of labor (design-md-theming.md:15-18);
  derivation = the 3-list/kind/tolerance record, enforced at apply (:12-15) and re-derived
  in-corpus (:622-630); fonts = pick-the-bar, with the fallback-chain synthesis (chart
  bar-rows.html:82,142) keeping the link as the one documented remote.

## What Worked

- Runner contracts read before any write: lineage completion = non-empty `research.md` +
  parseable `deep-research-state.jsonl` + iteration records 1..5 (integer `iteration` field) +
  synthesis event whose stopReason starts with `maxiteration` (fanout-run.cjs:655-885).
- Census-first, targeted-read-second: every "one example that fails today" came from a measured
  census, not suspicion; it also caught a wrong dispatch fact (title-first 33/34 -> 34/34).
- Reading the standard's source BEFORE designing the answer (palettes.json before the token
  design; apply-design-md.cjs before the applicator decision) turned design questions into
  documented-shape adoptions.
- Treating the README's wording as DATA ("no external images") — a seeming contradiction became
  a pick-a-bar decision.

## What Failed

- A multi-command shell line with a variable assignment was rejected by the pi executor once
  ("does not prove one direct executor"); plain `&&` chains without variable assignments pass.
- Two shell-quoting retries and one perl syntax error; a 4px probe lost its filenames (no $ARGV
  in the printf) and had to be rerun. Attribute every census line to its file the first time.
- (Runs 2-3: clean — one pass, no retries.)

## Exhausted Approaches

(none yet)

## Ruled-Out Directions

- Counting coral elements by `#eb6c36` occurrence-count — accent also spells itself
  `rgba(235,108,54,α)` and one focal element is 3+ occurrences; occurrence is not element
  (type-high-level.md:209).
- Foundations-only token source — orphans `#3d4460`, the only typed value it misses
  (comm(E1); type-high-level.md:418-419).
- The chart dual-block-per-file for diagrams — 0/38 `prefers-color-scheme`; 27×2 grounds;
  the export contract ships one svg node (SKILL.md:374-389).
- A second carried exemplar (diagram-side) — the 34-example corpus already demonstrates the
  voice; the pin discipline transfers via the derivation record (check-corpus.cjs:3110-3133;
  palettes.json:142-143).
- A second DESIGN.md dialect as the applicator's input — the run-2 token source already carries
  the vocabulary the 27 types read.

## Next Focus

Iteration 4 — the corpus shape: 34 examples against 4 templates (the chart: 29 templates, no
examples); sort the examples — which are the one canonical file per type (a template in
disguise), which are variants (dark, full, terminal, sketchy, consultant) and which are
decoration; decide the template/example split, what screenshots cover, what a catalog (the
chart's references/catalog.md, read in both directions by the check, :2530-2610) would look like
for 27 types, and what moves out of the 37KB SKILL.md — including the command: the stale names
in diagram.md:67 vs the actual YAMLs and the mode-registry mismatch. Carry in: the 1-block/2-block
contracts (F2.3; check-corpus.cjs:618-634), the exemplar/corpus question (F3.5), the ramp
question (F3.7).
