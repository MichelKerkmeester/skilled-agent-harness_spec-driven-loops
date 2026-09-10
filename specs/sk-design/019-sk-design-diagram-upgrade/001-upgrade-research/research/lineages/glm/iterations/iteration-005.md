# Iteration 5: The verification loop and the phase plan

## Focus

Angle 5 of 5: the chart's mutation-suite contract adapted to the diagram checker of angle 1; the
CI gate; what a fresh-reader capture review catches that no check can; then sort every finding
from angles 1-4 into [enforceable by a family] vs [judged], rank, and propose the phases after
this one — name, scope, the gate each ends on, and their order.

## Findings

1. **The mutation suite is a hedge against its own author, and its four contracts are written
   down.** The header: "Standing proof that every corpus assertion fails when the thing it
   describes is broken… Two reviews found twenty-one assertions that passed for a reason other
   than the one their message gave: a guard that could never be true, a regex satisfied by a
   function's own definition, four families reading comments as code, one family comparing a
   record against itself. Each was found by hand, fixed, and re-proved by hand. This turns that
   into something that runs" (`corpus-mutations.test.cjs:3-9`). The harness: a case MUTATES ONE
   SHIPPED FILE and reads it back through the REAL checker as an `--extra` directory — "the
   corpus itself is never touched, so a crashed run cannot leave the packet dirty" (`:43-44`) —
   and it refuses: (1) a case whose **anchor** is missing ("the patch anchor is not in…; a case
   whose patch does not apply proves nothing", `:48`); (2) a case whose **base** is not already
   clean ("already fails… unmutated, so this case would prove nothing", `:57`); (3) a case whose
   **failure comes from another family** (after > 0 AND the message must match the case's
   expect-regex, `:66-70`). Adaptation notes: the diagram's shipped corpus fails its own rules
   TODAY (23/34 markers, grid in flowchart, fonts in 38) — the base-clean contract therefore
   PRESUPPOSES the repaired corpus, which fixes the phase order (finding 5); the four
   twenty-one-assertions defect classes are exactly the risks of a regex-over-SVG checker
   (attribute order, comment-vs-code — this research's own `x1…y2` order assumption lives there).
   [SOURCE: corpus-mutations.test.cjs:3-14,43-70]

2. **The completeness guard is three-way and even the exemptions carry reasons that can rot.**
   "Coverage written once follows the work that prompted it and then rots: the next family
   arrives, nobody writes a case, and the suite still passes. So the suite asserts its own
   completeness. A family may sit outside it only by being named here with a reason, and a
   reason that has stopped being true fails too" (`:512-518`). Three tests: every family the
   CHECKER registers has a case here or a stated reason (`:542-548`); nothing here names a
   family the checker does not register ("so they assert nothing", `:550-555`); no
   NEEDS_A_BROWSER exemption outlives the family it excuses (`:557+`). registration is
   THIRD-DERIVED: the suite parses the CHECKER's source for `(tally|record)('…')` — plus the
   theme-aliased families, added by hand ("The palette rules address their family through a
   theme object rather than a literal": `palette-source`, `palette-source-dark`, `:527-534`) —
   while the covered set parses the SUITE's own `family: '…'` occurrences (`:536-540`). The
   diagram's THEMES are THREE grounds (light/dark/terminal, run 2), so its aliased set is
   palette-source-light/dark/terminal — the precedent extends, the exemption set (below) gets
   its own why-sentences, and the reason-rot test keeps them honest.
   [SOURCE: corpus-mutations.test.cjs:512-558]

3. **The CI gate: paths-triggered, marker-grepped, and deliberately without the render.**
   `chart-corpus.yml`: triggers on push/PR (paths = the skill subtree + the workflow itself) and
   workflow_dispatch; steps = node 20, `node scripts/check-corpus.cjs | tee /tmp/corpus.log` then
   `grep -q 'RESULT: PASSED' /tmp/corpus.log` (the LITERAL, because "Read the marker, not the
   exit code" — `check-corpus.cjs:14`), then `node --test scripts/tests/`. The stated doctrines:
   "This BLOCKS, unlike the advisory job, because the packet is green with no backlog behind it —
   a gate that nobody has to triage is a gate people still read", and "The render gate is
   deliberately not here. It drives an installed browser, and the one test that needs one says
   so and skips rather than passing quietly." The diagram's `.github/workflows/
   diagram-corpus.yml` mirrors this shape exactly — the no-backlog precondition is WHY the
   checker phase follows the repair phase (finding 5).
   [SOURCE: .github/workflows/chart-corpus.yml:1-39; check-corpus.cjs:14]

4. **The fresh-reader capture review — what no check can catch — has precedent, mechanics, and
   already a home.** The standard mechanizes three: `checkRenders` finds a browser (CHROME_PATH,
   or "drop --render and say plainly that rendering was not checked", `:2955-2960`);
   `settled-render` = "Rule 12's rendered half… each file is opened twice and both halves of what
   came back are compared. The document catches a drawing that is still building itself, and the
   PICTURE catches motion that has not settled, WHICH NO DOCUMENT DUMP CAN SEE because a CSS
   animation never touches the DOM" (`:2963-2966`); `dark-render` = "Rule 4's rendered half… no
   reading of the file can prove that block reaches the paint: a block nested wrong, or pasted
   outside its media query, MATCHES THE SOURCE IN BOTH DIRECTIONS AND STILL CHANGES NOTHING ON
   SCREEN. Opening each file a third time with the scheme pinned dark, and requiring a DIFFERENT
   PICTURE, is what observes it" (`:2967-2971`). For diagrams the same truth holds one level
   deeper — a `:root`-edited value shadowed by a later cascade rule matches every source check
   and paints differently — so the skin-flip picture-diff is the capture review's FIRST
   instrument. The brief's three (connector overlap, label collisions, focal balance) split:
   overlap and the 12px/6-10px/behind-box grades are 2D-computable EVENTUALLY (F1.10's
   "needs a 2D pass") but graded by VISIBLE-TRACEABILITY today; focal balance ("which 1-2 things
   DESERVE the accent") is judgment, full stop. And the diagram skill ALREADY carries the
   review's home: `manual-testing-playbook/` — "how realistic user-driven tests should be run,
   how evidence should be captured, how results should be graded" — with the persistence
   contract: "A scenario run is complete only after its PASS, FAIL, or SKIP outcome and reason
   are persisted through `run-manual-playbook-scenario.cjs` into
   `<skill>/benchmark/reports/<dated-run-label>/`; generated report Markdown is renderer-owned
   and never hand-authored" (`manual-testing-playbook.md:24-26`). One-locus note: the playbook
   fronts version 1.0.0.5 — the same value as the style-guide, a FOURTH version field in a
   THREE-value disagreement (finding 4's F4.3, now 4+1).
   [SOURCE: check-corpus.cjs:2953-2975; manual-testing-playbook/manual-testing-playbook.md:1-26]

5. **The phases after this one — each ends on a runnable gate, and the order is forced.** The
   forcing facts: the base-clean contract presupposes a repaired corpus (finding 1); the
   no-backlog CI doctrine demands the corpus passes at introduction (finding 3); the derivation
   record gates the applicator, which gates the repaint, which gates the checker's families
   (runs 2-3); the completeness guard needs registered families (finding 2), which need the
   contracts the decisions settle (run 1). Therefore:

   - **P2 — `skin-contract`** (the decisions and the record). Scope: the seven contract
     decisions signed — the 4px exemption list (resolving `:403` vs `:337`), marker vocabulary +
     uniqueness scope, the node/coral markup conventions, the self-contained bar (pick:
     keep-the-link + fallbacks), the emphasis mapping (accent 2.86 vs 3.0: a departs-row or a
     re-derivation), the token-source scope (`#3d4460` promoted to a named type-role), the
     variant lattice (prove sketchy or descope); PLUS the derivation record itself — 3 lists
     (verbatim / departs-to-clear-a-gate / arithmetic), kinds (accent-at-alpha, ink-at-alpha,
     inversion, cross-skin-alias), the gates block with its `ungated` rows, tolerances, and the
     reference+sha256 of the stock skin; PLUS the one-locus truths — fallback chains, ONE 4px
     locus, ONE accessibility locus (×3→1+2refs), treatments → the guide, ONE version field, the
     two YAML names, ONE ownership locus, the :52 note made true or deleted.
     **Gate:** the record round-trips — every one of the 25 values and both accent spellings
     traces to a primary+rule by grep; exactly ONE locus each for the 4px rule, the
     accessibility contract, the ownership, and the version; `--default-diff` defines stock.
   - **P3 — `applicator+sentinels`.** Scope: sentinel `DIAGRAM_PALETTE:BEGIN skin=light|dark|
     terminal … :END` blocks (ONE per file — the run-2 residency) in the 4 templates; the
     applicator as a third hand-run script: input = the token source (no second DESIGN.md
     dialect), theme gates computed at APPLY via the ported 4-function module
     (`channel, luminance, contrast, round2` — `check-corpus.cjs:26`) against the THREE grounds
     (the THEMES×3 precedent), outputs = COPIES to `--out`, `--default` reproduces the stock
     bytes, the shipped-default detection mechanized (`SKILL.md:311` → the diff).
     **Gate:** `--default` over the 4 templates == the stock bytes; below-threshold outputs are
     refused; the departs-rows honored.
   - **P4 — `corpus+catalog`.** Scope: the derivation-driven repaint — 1,585 literals + 4
     template roots via `--all --out` copies promoted after DIFF-verification (the :52 "v5.1"
     debt discharged); 38/38 fresh screenshots; the sketchy proof (one example) or its descope;
     the catalog — the question-keyed selection guide (`SKILL.md:32-69`) moves to
     `references/catalog.md` with the machine columns (canonical example, variant lattice,
     ceilings — sourced from the 27 type files, import paths, primitives, the specimen row, the
     SKIN column sourced from the sentinel block); BOTH directions hand-verified now (the
     automated check lands in P5); the one-locus pass completes (the 37KB → hub+references).
     **Gate:** examples−references = ∅ and STAYS ∅; the 38 PNGs re-captured; the catalog's
     both-directions hand-check documented; the shipped corpus passes EVERY family-to-come
     (the no-backlog precondition, proven by a full checker dress-run).
   - **P5 — `checker+mutations+CI`.** Scope: `scripts/check-diagram-corpus.cjs` — the families
     from angle 1 as contracted: accessibility+metadata (F1.3, 34/34 today), no-external with
     the ONE documented-stylesheet exception (F1.4+F3.1; precedent `:936-938`), grid-4px per
     the adjudicated exemption list (F1.5), orthogonal+type-allowlist (F1.6; radar spokes),
     marker-trio+unique-ids at the decided scope (F1.7), gates-vs-sentinel-blocks across THREE
     grounds (F2.5+F3.7), the derivation re-derivation (F3.6: `rule == inkRGB@α`,
     `tint == accentRGB@α`, "a solid value wearing an alpha channel", `:622-630`), and the
     catalog both-directions (F4.4); PLUS the mutation suite — the four refusals, the
     completeness triple, the NEEDS_A_BROWSER/NEEDS_AN_EYE exemptions each WITH a why-sentence
     and the reason-rot test; PLUS `.github/workflows/diagram-corpus.yml` — paths-triggered,
     `RESULT: PASSED`-grep, `node --test`, the render-exclusion note.
     **Gate:** the suite's own — every registered family has a case or a reasoned exemption;
     every case's mutant fails its NAMED family with its expected message; CI green with no
     backlog.
   - **P6 — `capture+judgment` (permanent).** Scope: the playbook scenario formalized — the
     skin-flip picture-diff (a THIRD capture with the skin pinned, requiring a different
     picture), the settled double-capture, the judged checklist (type fit, remove test, taste,
     the 6-10px VISIBLE gap, the deserved-focal, the unavoidable-box exception); the
     graduation pipeline: judgments that become 2D-computable (overlap, the 12px fan) move INTO
     the checker — logged, one-way. Persistence: PASS/FAIL/SKIP + reason through
     `run-manual-playbook-scenario.cjs` into the dated reports (renderer-owned).
     **Gate:** the playbook's own — a dated report per release; no hand-authored report
     Markdown; every skipped check carries its reason.
   - **Order: P2 → P3 → P4 → P5 → P6** — decisions gate mechanism, mechanism gates the corpus,
     the corpus gates the assertions (no-backlog), and the eye permanently complements whatever
     the code has adopted. No phase's gate is passable without its predecessor's.

6. **The sort — every finding from angles 1-4, [enforceable by a family] vs [judged].**
   (C = needs the contract decision first; the decision is P2's deliverable.)
   - F1.1 no-checker → the P5 harness itself (not a family — the precondition).
   - F1.2 family-semantics → adopted wholesale as the P5 shape (mapping, not a rule).
   - F1.3 accessible-SVG (holds 34/34) → ENFORCEABLE (regression family; the 34/34 = the
     base-clean precondition already met).
   - F1.4 no-external 38/38 → ENFORCEABLE after C(bar) — then one whitelisted href.
   - F1.5 4px + :403/:337 → ENFORCEABLE after C(exemptions); the contradictions themselves =
     one-locus (P2, grep-verified).
   - F1.6 orthogonal+allowlist → ENFORCEABLE-lite (regex + the type table's decoration list);
     overlap/fan/gap/behind-box → JUDGED until the 2D pass (P6-graduation).
   - F1.7 marker trio + ids → ENFORCEABLE after C(vocabulary, scope); today 23/34 fail —
     P4 repairs, P5 asserts.
   - F1.8 budget semantics → JUDGED until the markup conventions exist (C); then ENFORCEABLE
     (the conventions ARE the regex).
   - F1.9 token scope → ENFORCEABLE after C(scope): examples−references = ∅, asserted.
   - F1.10 what-cannot-hold → the JUDGED column's definition (P6 owns it; graduation logged).
   - F2.1 census → ENFORCEABLE (colour-literals analog: 25 values, per-skin quarantine).
   - F2.2 coverage → ENFORCEABLE after C(scope): the both-directions count.
   - F2.3 residency (decided) → ENFORCEABLE: 1 sentinel block/file, no media query needed —
     the INVERSE of the chart's 2-block+prefers-color-scheme rule (`:618-621,630-634`).
   - F2.4 derivation-stale → ENFORCEABLE after the record (F3.6): the rgba spellings
     re-derive; the warm spellings = gone.
   - F2.5 computed gates → ENFORCEABLE after C(mapping+signoff); the 4-function module makes
     them cheap. soft 3.48 = the named departs-or-exempt.
   - F2.6 repaint → not a rule — a PHASE (P4); its GOVERNANCE (E2=∅) = ENFORCEABLE.
   - F3.1 two bars → ENFORCEABLE after C(bar): the whitelist = the decision, written.
   - F3.2 fallback chains → ENFORCEABLE (three chains, one result: the no-network default
     renders structured).
   - F3.3 trio load-bearing → JUDGED (the metric-reflow question; the PLAYBOOK captures the
     substituted-font renders if ever needed).
   - F3.4 applicator → not a rule — a PHASE (P3); its GOVERNANCE (--default==stock,
     copies-not-in-place) = ENFORCEABLE (the applicator tests in CI, the chart's precedent:
     the CI runs "applicator tests", `chart-corpus.yml:36-39`).
   - F3.5 pin discipline → ENFORCEABLE (derivation.reference+sha256 EXISTS + origin-pins
     present — the presence checks; the byte-depth = C(left open, documented).
   - F3.6 derivation record → ENFORCEABLE (the re-derivation family, `:622-630`-shaped).
   - F3.7 emphasis/gates mapping → ENFORCEABLE after C(mapping); the 2.86-vs-3.0 = the
     departs-row.
   - F4.1 taxonomy → ENFORCEABLE (the catalog: 27 canonical ↔ 27 type-ids, both directions;
     the variant lattice = the LATTICE column, asserted; sketchy = a row or a descope).
   - F4.2 screenshots 1:1 → ENFORCEABLE (the 38-file ↔ 38-PNG presence check); the
     warm-vs-cool question → JUDGED/pixel (P6's first capture).
   - F4.3 mirrors → ENFORCEABLE (versions = 1 locus; YAML names = the workflow-verified
     referents; ownership = the registration cites — the catalog+registry join).
   - F4.4 catalog → ENFORCEABLE (the both-directions + system/skin-column families).
   - F4.5 one-locus → ENFORCEABLE as counted loci (accessibility ×1, 4px ×1, treatments ×1 —
     grep-counts); the PROSE quality → JUDGED.
   - F4.6 command → ENFORCEABLE (the YAML names = 2 string-assertions; version = 1).
   Totals: of the 29, roughly 21 land enforceable-by-family (17 after a P2 decision), 6 judged,
   2 phase-governance — the counted-loci doctrine means even the judged column SHRINKS into the
   checker over time, and the eye keeps only what the brief reserved for it.
   [SOURCE: the findings registry, F1.1-F4.6, eachElectrodeed to its iteration]

## Sources Consulted

- `corpus-mutations.test.cjs:1-70,512-558` — the four contracts, the completeness triple, NEEDS_A_BROWSER with reasons, registeredFamilies/coveredFamilies
- `.github/workflows/chart-corpus.yml:1-39` — triggers, the marker-grep, `node --test`, the no-backlog and no-render doctrines
- `check-corpus.cjs:14,26,2953-2975` — the marker, the 4-function gates module, checkRenders/settled/dark + the paint-truth doctrine
- `manual-testing-playbook/manual-testing-playbook.md:1-26` — the capture-review home, the persistence contract, the 4th version field
- The findings registry F1.1-F4.6 (this lineage, iterations 1-4)

## Assessment

- **newInfoRatio: 0.9** — the mutation harness's four contracts, the completeness triple with
  reason-rot, the render-truth doctrine, the playbook's persistence contract (and the FOURTH
  version field), and the 4-function gates module are newly read; the findings-sort and the
  phase plan are synthesis, priced honestly.
- Novelty justification: the harness, the CI doctrines, and the playbook were unread before this
  iteration; the sort maps EXISTING measurements (no new claims), and the phases depend only on
  already-cited facts.
- Confidence: high on the quoted contracts; the phase order is derived, not measured — its
  justification (base-clean + no-backlog + record-before-applicator) is argued from the standard's
  own doctrines, and the P2 decisions remain theirs to sign.

## Reflection

- What worked: reading the harness BEFORE designing the diagram's — the four refusals, the
  reason-rot test, and the third-derivative registration answered design questions the brief
  had not bothered to ask; the playbook's persistence contract turned "add a capture review"
  into "formalize what exists".
- What failed: one filename slip (README.md vs manual-testing-playbook.md)cost a retry; the
  sk-vision outage from run 4 still covers the PNG-staleness thread.
- Ruled out: putting the render gate in CI (the standard's own note: it drives an installed
  browser; "the one test that needs one says so and skips"); proposing the checker BEFORE the
  corpus repair (the base-clean refusal would fail 23/34+files at birth — the no-backlog
  doctrine forbids it).

## Recommended Next Focus

Nothing — the loop is complete at the cap. The synthesis consolidates the 29 findings, the
ranked recommendations, and the phase plan; the convergence report records the stop
(maxIterationsReached at 5/5, telemetry: entropy 1.0, mean newInfoRatio 0.88).
