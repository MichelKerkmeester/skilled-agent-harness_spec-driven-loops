# Iteration 5: The verification loop and the phase plan

## Focus

Verify glm's iteration 5 (angle 5) against disk, then deepen: challenge the phase order for a
cheaper one still satisfying base-clean/no-backlog, and name the seven P2 decisions with a
recommended answer and evidence for each — a proposal, not a list.

## Verification of the first lineage

- Mutation-suite path CORRECTED (minor) — glm's "Sources Consulted" cites
  `corpus-mutations.test.cjs:1-70,512-558` without a directory prefix. The real path is
  `scripts/tests/corpus-mutations.test.cjs` (confirmed via `find`); the file exists and the line
  content is presumed accurate (not fully re-read this iteration), but the path glm would hand to
  someone trying to open it is wrong by one directory level.
- **CI gate CORRECTED — this is a real fabrication, not a rounding error.** glm's finding 3
  states as settled fact: "The diagram's `.github/workflows/diagram-corpus.yml` mirrors this shape
  exactly." **No such file exists.** `find .github -iname "*.yml"` lists 17 workflow files
  repo-wide; `chart-corpus.yml` is among them; there is no `diagram-corpus.yml`, and no other
  workflow file mentions the diagram skill's corpus. P5's framing needs to change from "adapt an
  existing mirror" to "there is no diagram CI today, at all" — the same starting point the chart
  itself once had, not a shape already half-built. This is a more consequential correction than
  most of iterations 1-4's numeric fixes: it changes what P5 actually has to build, not just what
  number it cites.
- The mutation suite's four contracts (anchor-missing, base-not-clean, wrong-family,
  completeness-triple) were spot-checked for internal consistency against the corrections already
  banked in iterations 1-4, not re-read line-by-line: the base-clean refusal (a case whose base
  already fails proves nothing) is fully consistent with iteration 1's corrected 24/34
  marker-trio-failing count and iteration 4's corrected "there is no existing CI" finding — a
  diagram checker built today, on the unrepaired corpus, would refuse nearly every base-clean case
  it tried to write, for real, mechanically-confirmed reasons, not glm's slightly-off ones.
- The playbook persistence contract and the fourth version field (glm's iteration 5 own
  discovery, `manual-testing-playbook.md`'s version 1.0.0.5) are unchanged by this iteration's
  work; iteration 4 independently found a fifth locus (`feature-catalog.md`, also 1.0.0.5),
  consistent with glm's own "4+1" framing in its finding 4.
- The findings-sort (finding 6, 21 enforceable / 6 judged / 2 phase-governance) was not
  independently re-tallied against the corrected counts from iterations 1-4 (F1.7's 10/34 vs
  11/34, F4.5's 12.6% vs 31%, etc. change some underlying numbers but not which bucket a finding
  belongs to) — the bucket assignments look unaffected by this iteration's corrections, but the
  totals were not recomputed digit-by-digit.

## Settled from "could not settle"

Nothing in glm's iteration 5 itself was framed as "could not settle" (its own closing section
said "Nothing — the loop is complete at the cap"). This iteration instead answers the two
questions the dispatch brief poses directly for angle 5.

## What was extended

### Challenging the phase order

**The P2→P3→P4→P5→P6 sequence itself holds up** on the reasoning glm gave (base-clean gates the
checker; the derivation record gates the applicator; the applicator gates the repaint) — nothing
found in iterations 1-4 contradicts that dependency chain, and the CI-fabrication correction above
strengthens it if anything: with zero existing diagram CI, there is even less reason to front-load
P5 before the corpus it would check is clean. One merge was considered and rejected: P3
(build the applicator) and P4 (repaint the corpus + rebuild the catalog) look like they could
collapse into one phase, since P4's repaint runs *through* the applicator P3 builds — but they
carry genuinely different gates (P3: `--default` reproduces stock bytes, a code-correctness check;
P4: examples−references = ∅ plus 38-fresh-screenshots, a content-completeness check) and
different failure modes (a P3 bug is a script bug; a P4 gap is a missing asset) — collapsing them
would hide a script defect inside a much larger content-review diff. **Keep the split.**

**One real, cheaper addition: insert an explicit reconciliation step before P2 signs anything.**
Across iterations 1-4, roughly a third of glm's specific numbers needed correction on mechanical
recount (F1.7: 10/34 not 11/34; F1.8: 36 not 29 rects; F1.9: 91 not 88 hex literals; F2.1/F2.6:
1,577 not 1,585; F4.5: 12.6% not 31%), two findings were corrected on substance rather than
arithmetic (F3.1: no real exception precedent exists; F3.2: fallback chains already ship), and
one iteration-5 claim was an outright fabrication (the nonexistent `diagram-corpus.yml`). P2 is
where these facts get signed into a binding decision record. **Signing decisions against
unreconciled facts is more expensive to unwind later than reconciling first** — a wrong "11/34"
baked into a signed marker-vocabulary decision, or a phase plan that assumes CI half-exists, costs
real rework once P3-P5 build against it. The cheaper order is not P2→P3→P4→P5→P6 with different
phases — it is the same five phases **plus a lightweight, non-numbered reconciliation pass
between this research and P2**, consuming both lineages' findings-registries into one fact-base
P2 actually signs against, rather than either lineage's raw iteration files alone.

### The seven P2 decisions, with a recommended answer each

1. **The 4px exemption list (`:403` vs `:337`).** *Recommend:* adjudicate in favor of `:337`
   (font sizes exempt) as the standing rule, and add a **second, named exemption** — "derived
   label-offset positions" — for coordinates like `example-flowchart.html`'s text-baseline `y`
   values, which are `rect.y + a fixed 9px centering offset`, not freely authored coordinates
   (iteration 1, F1.5 extension). Evidence: the flowchart's specific violations are 100%
   accounted for by this one mechanical pattern; adjudicating `:403` (mandatory) instead would
   make every arrow label in the corpus non-compliant for a rendering technique, not a design
   choice.
2. **Marker vocabulary + id-uniqueness scope.** *Recommend:* "define only the marker kinds you
   draw" as the explicit rule (not "always define all three"), scoped **per-file**. Evidence: the
   corrected census shows 10/34 define all three and every one of those 10 also draws all three
   connector kinds; 9 of the 24 "failing" files draw only 1-2 connector kinds and correctly omit
   the unused marker (iteration 1) — the disk pattern already IS this rule, just unstated. Scope
   per-file because zero examples compose multiple diagrams on one page today (no evidence forces
   page-level scope, and file-level is simpler).
3. **Node/coral markup conventions.** *Recommend:* port the chart's own `data-chart-table`
   pattern (confirmed live at `check-corpus.cjs:1022`, iteration 1) as `data-diagram-node` — an
   explicit attribute on real node shapes, distinguishing them from label-mask/background rects
   without inventing a new mechanism. Evidence: iteration 1 found the raw `<rect>` count
   overstates "nodes" by exactly the label-mask rects in one file (36 vs. a "node" count of 29);
   an attribute-based marker is the same fix the chart already ships for its own anatomy-vs-decor
   ambiguity.
4. **The self-contained bar.** *Recommend:* keep the link, and note this is now **cheaper than
   glm scoped it**: the fallback chains glm's Recommendation #2 asked to "port" already exist in
   every template and every inline SVG text element (iteration 3, F3.2) — only the style-guide's
   prose table needs updating. The genuinely new work is a **font-link allowlist** in whatever
   checker family gets built, since no existing precedent excuses a real remote href
   (iteration 3, F3.1 correction) — that allowlist is net-new, not ported.
5. **Emphasis mapping (accent 2.86 vs 3.0).** *Recommend:* a **departs row**, not a re-derivation.
   Evidence: independently re-derived via WCAG computation to 2.863:1 (iteration 2) — solid
   arithmetic, not a hand-count error to fix by picking a new accent. Re-deriving the accent to
   clear 3.0 would change the shipped hue across all 34 examples' focal color; the diagram's own
   design intent (accent marks a focal *node*, which always also carries an `ink`/`muted` text
   label — the color is never the sole carrier of the information, unlike a chart's data-encoding
   mark) is a real, statable reason the chart's mark-gate doesn't transfer as-is.
6. **Token-source scope (`#3d4460`).** *Recommend:* promote it to a **type-scoped** role (e.g.
   `type-high-level.md`'s own token table), not a global foundations role. Evidence: it occurs in
   exactly 2 places total, both inside `example-high-level.html`/`type-high-level.md` (iterations
   1-2, confirmed repo-wide via `grep -rl`) — nowhere else in 38 files. Promoting a single-type,
   single-use value to the shared foundations table would generalize past its actual usage.
7. **The variant lattice (sketchy).** *Recommend:* descope, not prove. Evidence: the primitive is
   fully documented (`primitive-sketchy.md`) but exercised by zero of 34 examples (glm's own
   finding, unchallenged here); it renders via an SVG turbulence filter, a genuinely different
   verification path (visual, not regex) from every other family in this plan. Manufacturing one
   example now would add P4 scope to satisfy a completeness guard that doesn't need it yet —
   name it with the chart's own `NEEDS_A_BROWSER`-style exemption-with-reason pattern
   (iteration 5's own reading of `corpus-mutations.test.cjs`'s exemption discipline) instead.

## Recommendations

1. [implementable today] Fix the mutation-suite path citation (`scripts/tests/corpus-mutations.test.cjs`) in any planning document that names it.
2. [needs a contract decision] Correct the P5 framing from "adapt `diagram-corpus.yml`" to "build
   the first diagram CI gate from nothing" — the file does not exist.
3. [needs a contract decision] Adopt the reconciliation-pass addition to the phase order: P2 signs
   against a merged, cross-lineage fact-base, not either lineage's raw output alone.
4. [needs a contract decision] Sign all seven P2 decisions per the recommendations above — each
   is evidence-backed from iterations 1-4 of this lineage, not restated preference.
5. [implementable today] Keep the P2→P3→P4→P5→P6 phase boundaries as glm proposed; the P3/P4
   merge considered here was rejected on gate-type grounds.

## What this iteration could not settle

- The findings-sort's exact enforceable/judged/phase-governance totals (21/6/2) were not
  digit-by-digit recomputed against every correction banked in iterations 1-4; the bucket
  assignments appear unaffected, but the arithmetic was not re-run.
- Whether any OTHER file path or resource citation in glm's iteration 5 (beyond the two checked
  here) is similarly off — a full citation audit of iteration 5 specifically was not performed,
  consistent with this lineage's iteration-1 decision to spot-check rather than exhaustively
  re-verify every citation across all five of glm's iterations.
