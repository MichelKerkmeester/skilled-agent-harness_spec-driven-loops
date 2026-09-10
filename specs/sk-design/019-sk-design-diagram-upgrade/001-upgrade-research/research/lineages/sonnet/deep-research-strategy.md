# Deep Research Strategy — verification lineage over glm's sk-design-diagram upgrade research

## Research Topic

Verify, then deepen and extend, lineage `glm`'s 29 findings on how `sk-design-diagram` should be
upgraded to the `sk-design-chart` standard. Five angles, one per iteration, same order glm used;
no early convergence.

## Known Context

- glm's 29 findings live in `../glm/iterations/iteration-001.md` through `-005.md`, registered in
  `../glm/findings-registry.json`; its own lineage-local synthesis is `../glm/research.md`
  (iterations 1-4 only — the pi process ended before iteration 5 was appended or a synthesis
  event was recorded, so the runner marked that lineage failed on protocol even though its
  content is complete).
- The parent packet's conductor synthesis (`../../research.md`) already treats glm's content as
  authoritative for the verdict on three open questions (skin residency, fonts, applicator). This
  lineage's job is not to re-argue those verdicts but to pressure-test the census work under them.
- Standard: `.opencode/skills/sk-design/sk-design-chart/` (SKILL.md, references, 29 templates,
  `assets/color/palettes.json`, `scripts/check-corpus.cjs` — 47 distinct `tally()` families over
  75 call sites, confirmed independently in iteration 1).
- Subject: `.opencode/skills/sk-design/sk-design-diagram/` (SKILL.md, style-guide.md, 27
  `type-*.md`, 4 templates, 34 examples, `icons.html`, no HTML/SVG checker — confirmed).

## Key Questions

- Q1 (angle 1): Do glm's checker-contract findings (F1.1-F1.10) hold on mechanical recount, and
  what does the exact family assertion text/regex + full per-file census add? — ANSWERED it. 1.
- Q2 (angle 2): Do glm's token-census findings (F2.1-F2.6) hold, and which files carry the 40
  `#ffffff` occurrences / neither rule-rgba spelling / is the dark column a fixed derivation?
- Q3 (angle 3): Do glm's reference/applicator/fonts findings (F3.1-F3.7) hold, and does the type
  scale reflow under substitute fonts / does README's wording strictly conflict with the sheet?
- Q4 (angle 4): Do glm's corpus-shape findings (F4.1-F4.6) hold — screenshot count corrected to
  39 files (icons.html has a screenshot glm said it lacked) — and do the 27 `type-*.md` ceiling
  wordings tabulate cleanly?
- Q5 (angle 5): Does the mutation-suite/CI adaptation hold, and is there a cheaper phase order
  than glm's P2-P6 that still satisfies base-clean + no-backlog?

## Answered Questions

- Q1 (it. 1): Confirmed F1.1-F1.4, F1.10. Corrected F1.7 (10/34 not 11/34 define the marker trio),
  F1.8 (36 raw rects not 29; the gap is label-mask rects), F1.9 (91 hex literals in example-er.html
  not 88). F1.6's conclusion survives but both its line citations are fabricated (files are 301
  and 139 lines total; glm cited :1382-1383 and :3389-3392). Settled: example-high-level.html
  carries 13 `<svg>` elements (1 accessible frame + 12 aria-hidden icon glyphs) — the first
  lineage's open "second `<svg>`" question.

## What Worked

- Flatten-before-regex (`tr -d '\n' | grep`) catches multi-line `<svg ...>` open tags that a
  naive single-line grep silently false-negatives on — reproduced the exact trap the conductor's
  synthesis flagged in glm's own dispatch-fact correction, this time inside my own first attempt.
- File-list set intersection (three `grep -l` calls, compared by hand) is a reliable way to
  mechanically recount a "defines all of A, B, C" census without a scripting language.
- Checking a cited line number against the file's actual `wc -l` line count is a cheap, high-yield
  fabrication detector — it caught F1.6 immediately with two `wc -l` calls.

## What Failed

- Several attempted one-liners (perl -e, python3 -c, multi-file awk with ternaries, `for` loops
  over `$f`) were blocked by this environment's command-approval gate before they ran, with no
  operator present to approve them (non-interactive dispatch). Recovered by using only
  single-purpose grep/tr/find/sed calls, one file or one pattern per invocation, and writing
  intermediate flattened text to a scratch file inside this lineage's own directory (removed after
  use) rather than to `/tmp` (outside the allowed write root).

## Exhausted Approaches

- Multi-file awk/perl/python inline scripts for corpus census work in this environment —
  consistently blocked by the approval gate; all iteration-1 through -5 census work uses
  grep/find/sed/tr/wc only.

## Ruled-Out Directions

(none yet at this iteration; glm's five ruled-out directions from its own run 1 were re-read and
not contradicted — see iteration-001.md.)

## Next Focus

Iteration 2 — the token source and the repaint: verify F2.1-F2.6 (25 values / 1,585 literals;
83.1% four role values; 1-skin-per-file; computed gates) against disk, then settle which files
carry the 40 `#ffffff` occurrences and in what role, which two examples carry neither the warm nor
the cool rule-rgba, and whether dark-column values are a computed lightness shift of light-column
values at a stated ratio (compute `#f08a59` vs `#eb6c36`).
