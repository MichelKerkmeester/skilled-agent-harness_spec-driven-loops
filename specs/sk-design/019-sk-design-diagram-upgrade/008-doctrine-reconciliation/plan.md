---
title: "Implementation Plan: Phase 8: doctrine-reconciliation"
description: "Resolve S1-S9 in the direction each already names, edit the losing document or files to match, and graduate S3's dash-fidelity rule and S8's short-connector rule into named checker families."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: doctrine-reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Static HTML/SVG diagrams, CommonJS Node.js scripts (no build step) |
| **Framework** | None — the diagram skill's own hand-rolled checker/applicator/mutation-suite trio |
| **Storage** | None — flat files under `assets/` and `references/foundations/` |
| **Testing** | `node --test` against `scripts/tests/corpus-mutations.test.cjs` |

### Overview
Nine systemic patterns, each already resolved to one direction by the manual review: six are prose corrections to `style-guide.md` and `derivation-record.md` (S1, S6, S7) or markup corrections across a named file set (S2, S4, S5), two carry a fix half plus a checkable half (S3, S8), and one is a corpus-wide starter-token wiring pass across all four templates (S9). The two checkable halves become new named families under `scripts/families/`, proven by one mutation case each, added only once the corpus they check is already green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- 007's F4, F6, F14, F17, F22, F26, F31, F32 fixes are confirmed present on disk before S2/S3/S8 tasks run.
- The corpus checker prints `RESULT: PASSED` with the existing ten families before either new family is added.

### Definition of Done
- All fifteen requirements in `spec.md` are satisfied, verified against `acceptance-criteria.md`.
- `check-diagram-corpus.cjs` prints `RESULT: PASSED` with twelve families; `node --test scripts/tests/` exits `0`.
- The applicator's `--default` and `--default --examples` byte-identity property holds.
- A corpus-wide grep finds no document stating a value the corpus does not hold.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct file correction plus two additive checker-family modules, following the existing `scripts/families/*.cjs` registry pattern — a new file dropped into that directory is auto-discovered by `check-diagram-corpus.cjs`'s `loadFamilies()`, with no change needed to the checker's own registration code.

### Key Components
- **`style-guide.md` / `derivation-record.md`** — the two reference documents S1, S6 and S7 correct. Neither gains a new section; each gets specific sentences and table rows rewritten to state what the corpus already holds.
- **`legend-fidelity.cjs`** (new, `scope: 'file'`) — for a file with both a "LEGEND" text marker and at least one dashed swatch after it, asserts every legend-region `stroke-dasharray` value equals some pre-legend drawing element's `stroke-dasharray` value. Identifies the legend region the same way a human reader does: everything from the file's first `>LEGEND<` occurrence onward, since every file in the corpus draws its legend last.
- **`short-connector-labels.cjs`** (new, `scope: 'file'`) — for a `<line>` classed as a connector (reusing `orthogonal-connectors.cjs`'s connector-detection heuristic) whose endpoint-to-endpoint length is under ~60px, asserts no `class="label-mask"` (or equivalent paper-fill) rect's bounding box overlaps the connector's own bounding box. Axis-aligned only, matching `orthogonal-connectors`'s own guarantee that every connector in the corpus is already elbow-only — no general 2D path intersection is needed.
- **Starter token wiring (S9)** — CSS classes added to each template's `<style>` block (never a `var()` written directly into a presentation attribute, per the packet's own convention that a starter's re-theme surface is its stylesheet, not its markup) resolving to `var(--color-<role>)`, applied to at least one element inside that template's `<svg>` per declared role other than `link`.

### Data Flow
A reference document read by a future diagram author (`style-guide.md`, `derivation-record.md`) states a role's value or a corpus-wide default; a template or example file paints that value, either as a literal (the defect S9 exists to close) or through a CSS class resolving a custom property the sentinel block declares (the fix). The corpus checker reads every file in `assets/templates/` and `assets/examples/` and asserts each family's rule; the mutation suite reads the checker's own family registry and proves each rule fails for its stated reason before the CI workflow (built in 005, unmodified here) blocks a future PR on the same two gates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase's `research_intent` is a mix of `fix_bug` (S1-S9 are each a documented contradiction between a doc and the corpus, or within the corpus) and small additive tooling (the two new families). The affected-surfaces table below covers the fix half; the two new families are additive and carry no producer/consumer inventory of their own beyond the registry auto-discovery already proven in 005.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `style-guide.md` §1 series-palette section | States the palette is for "chart types... (currently: radar)" and forbids backfilling to non-chart types | Update: widen to "multi-series charts plus typed-chip vocabularies," name the four typed-chip files | `grep -n "typed-chip" style-guide.md` returns the corrected sentence |
| `style-guide.md` §1 accent citation | States `#f7591f` as an example hex nowhere in the corpus | Update: remove the specific wrong hex from the illustrative sentence | `grep -c "f7591f" style-guide.md` reports `0` |
| `style-guide.md` §1 token table, `rule-solid` row | States light `rule-solid` as `#bfc0c0` (silver), disagreeing with the template and the JSON | Update: `rgba(79,93,117,0.25)`, matching `diagram-palette.json` | `grep -n "rule-solid" style-guide.md` shows the corrected row |
| `style-guide.md` §5 dot-pattern sentence | States the pattern is "optional, not default" against a corpus that ships it in 26 of 34 files | Update: state the pattern is on by default, name the eight opt-out files | `grep -n "on by default" style-guide.md` returns the corrected sentence |
| `derivation-record.md` §2 light `rule-solid` row | States `#bfc0c0`, kind `primary`, disagreeing with the template and the JSON | Update: `rgba(79,93,117,0.25)`, kind `derived: muted at 0.25` | `grep -n "rule-solid" derivation-record.md` shows the corrected row |
| `derivation-record.md` §6 PINS table | States a sha256 per template file | Update: recompute for every template this phase edits | `shasum -a 256` on each edited template matches the recorded row |
| Ten named files' `<text fill="#7a8399">` elements | Paint `soft` as a text fill, below the 4.5:1 text gate the corpus itself records as a departure limit | Update: repoint to `#4f5d75` (`muted`, 6.11:1) | `grep -c '<text[^>]*fill="#7a8399"'` reports `0` per file after the fix |
| `example-dp-integration.html`'s `--custom-red`/`--custom-blue` | Names two hues by the wrong colour word | Update: rename to the accurate colour word everywhere the property is declared or referenced | `grep -c "custom-red\|custom-blue"` reports `0`; the file still renders identically (only the property name changed, not its value) |
| `template-full.html` legend dash arrays (`:353`, `:359`) | `4,3`/`3,3` against real elements at `5,4`/`4,4` | Update: match the swatch to the element it keys | `legend-fidelity` family reports zero failures for this file once added |
| `example-high-level.html` legend line swatches (`:293`, `:296`) | No `marker-end`, though every real connector of that class carries one | Update: add the matching marker reference | Visual re-render; `marker-vocabulary` family continues to pass (no dangling reference introduced) |
| `template-full.html` / `example-architecture.html` legend fills | Three keyed fills at low, close alphas of the same or a related hue | Update: step the legend-swatch-only alphas to a visibly separable sequence, leaving the corpus-wide node-type-treatment table untouched | Visual re-render; `style-guide.md` §4 unchanged (grep confirms no edit) |
| Four non-conforming files' legend entry text | UPPERCASE or lowercase mono, against the majority sentence-case sans | Update: sentence-case Geist sans for entries; "LEGEND" heading stays mono uppercase | Visual re-render; `grep -c "Geist Mono" <file>` for the entry-text elements specifically drops to the heading-only count |
| `example-er.html` / `example-high-level.html` legend rule endpoints | `x2="960"` against content running to `980`/`996` | Update: match the drawing's own bounding box | Visual re-render confirms the rule now spans under the widest content element |
| Four templates' declared-but-literal-painted roles | A role's value appears as a hex literal inside `<svg>` (or not at all), never as `var()` | Update: CSS class per role, applied inside the `<svg>` | Per-role `grep -c 'var(--color-<role>)'` scoped to the region after `<svg viewBox` reports `≥1` |
| `check-diagram-corpus.cjs` judged-boundary comment | Lists "the visible label gap" as fully judged | Update: narrow the phrasing now that the short-connector case graduates | Direct read of the header comment |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Corpus check | All twelve families against 38 files | `node scripts/check-diagram-corpus.cjs` |
| Mutation | One case per family, four refusals, completeness triple | `node --test scripts/tests/` |
| Applicator | `--default` and `--default --examples` byte-identity | `node scripts/apply-diagram-tokens.cjs` diffed against the shipped files |
| Manual | Every edited file re-rendered and read before its task is ticked | Chromium screenshot via the shared render script, viewed directly |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 007's F4, F6, F14, F17, F22, F26, F31, F32 fixes | Internal (sibling phase) | Confirmed by Phase 1's own read task at execution time | S2/S3/S8 tasks would re-fix or collide with instances 007 owns |
| `diagram-palette.json`'s recorded `rule-solid` and `departures` entries | Internal (003/004 output) | Already correct; read and confirmed at authoring time | S7 would need a third correction target it does not currently have |
| The ten existing checker families and the mutation suite's completeness triple | Internal (005 output) | Shipped and green | The two new families would have no registry to auto-join and no triple to satisfy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a re-render of any edited file shows a regression (a legend becomes unreadable, a starter template stops rendering, the corpus checker regresses on a family this phase did not touch).
- **Procedure**: `git checkout -- <file>` per edited file, since every change in this phase is a targeted, line-scoped correction with no schema or cross-file rename beyond the `--custom-red`/`--custom-blue` property rename (itself confined to one file). Re-run the checker and the mutation suite to confirm the revert restored the prior green state.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Doc corrections (S1, S6, S7) ──────┐
Per-file fixes (S2, S4, S5, S9) ───┼──► S3/S8 fix halves ──► New families (S3, S8 check halves) ──► Full-corpus verification
                                    │
Pin recompute (S9 dependents) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Doc corrections (S1, S6, S7) | None | Full-corpus verification's doc-residue grep |
| Per-file fixes (S2, S4, S5, S9) | 007's confirmed fixes | S3/S8 fix halves sharing an edited file (`template-full.html`, `example-architecture.html`) |
| S3/S8 fix halves | Per-file fixes landing first where files overlap | New families (must not be added against a red corpus) |
| New families | S3/S8 fix halves green | Full-corpus verification |
| Full-corpus verification | Every prior task | Phase close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Three dependency/baseline reads |
| Core Implementation | Medium | Nine systemic-pattern dispatches plus two new-family dispatches, one per DeepSeek V4.1 Flash brief |
| Verification | Low | Four scripted checks (checker, mutation suite, applicator, grep sweep) plus visual re-render |
| **Total** | | Comparable to 007's per-file remediation; narrower per-file surface, one dispatch per systemic pattern |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Every edited file re-rendered and viewed before its task is ticked
- [ ] `check-diagram-corpus.cjs` confirmed green before either new family is added
- [ ] `derivation-record.md` §6 pins recomputed for every touched template

### Rollback Procedure
1. Identify the failing check (checker family, mutation case, applicator diff, or grep sweep).
2. `git checkout -- <file>` for the specific file the failing check traces to.
3. Re-run the same check to confirm the revert restores the prior state.
4. If the failure is in a newly-added family itself rather than a corpus file, remove the family file and its mutation case together, since the completeness triple would otherwise fail on an orphaned case.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — every artifact is a flat file under version control; `git checkout` per file is sufficient.
<!-- /ANCHOR:enhanced-rollback -->

---
