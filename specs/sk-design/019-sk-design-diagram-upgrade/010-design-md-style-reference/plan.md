---
title: "Implementation Plan: Phase 10: design-md-style-reference"
description: "Build apply-design-md.cjs, its stock reference, and the derivation-gates extension that gates a themed diagram delivery."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: design-md-style-reference

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS (`.cjs`) - matching the chart's own applicator and this packet's own `apply-diagram-tokens.cjs`/`check-diagram-corpus.cjs` exactly |
| **Framework** | None; `node --test` for the mutation suite, the same runner the packet's suite already uses |
| **Storage** | Flat files: one new script, one new reference doc, a three-file stock-reference folder, one extended checker-family module, one new fixture |
| **Testing** | `node --test scripts/tests/` for the mutation suite; the script's own stdout, grepped for `RESULT: PASSED`/`RESULT: FAILED`; `check-diagram-corpus.cjs` re-run for regression |

### Overview
This phase ports the chart's `apply-design-md.cjs` shape into the diagram skill by reading it for structure, never by importing or editing it (D12). Because a diagram's role vocabulary is structural chrome across three skins rather than four chart series across two grounds, the port is a redesign of the selection rules, not a copy: one accent instead of a four-series ladder, mechanically-derived hairlines, a conditional terminal skin, and whole-file literal remapping instead of sentinel-only substitution (the mechanism F32 shows a sentinel-only approach would miss). The stock reference is authored from the packet's own `diagram-palette.json`, not measured, and `derivation-gates.cjs` is extended - not duplicated - to gate a themed block's inline values while requiring its provenance comment.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 009's merged `assets/diagrams/` library state confirmed on disk, or the `assets/templates/`+`assets/examples/` fallback explicitly recorded (D13)
- [ ] `assets/color/diagram-palette.json`'s three skins, their exact role sets, and `gates`/`departures` blocks read directly, not from `references/foundations/derivation-record.md`'s prose
- [ ] The chart sibling's `apply-design-md.cjs`, `references/design-md-theming.md`, and `assets/style-reference/evilcharts/` read in full as the worked example (D12)
- [ ] Finding F32 read and its implication for the repaint mechanism (whole-file literal remapping, not sentinel-only) confirmed

### Definition of Done
- [ ] All acceptance criteria in `acceptance-criteria.md` are `Met`
- [ ] `apply-design-md.cjs --default --all --out <dir>` reproduces the stock corpus byte for byte
- [ ] `node --test scripts/tests/` passes, including the two new `derivation-gates` cases and the completeness triple
- [ ] `check-diagram-corpus.cjs` still prints `RESULT: PASSED` against the untouched stock corpus
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single-file CLI applicator (`apply-design-md.cjs`) plus an extension to an existing checker family (`derivation-gates.cjs`) - the same two-surface shape the chart sibling uses (`apply-design-md.cjs` + `check-corpus.cjs`'s `design-md`-aware palette handling), read for structure and reproduced with diagram-specific rules.

### Key Components

- **v3 heading parser**: `section`/`tableRows`/`parseColors`/`parseTypography`/`parseRadius`, ported by reading the chart script's implementation for shape (D12). Unchanged from the chart's own contract: a missing heading, table, or substitute is named and stops the run.
- **Per-form role discovery**: reads a selected form's own `DIAGRAM_PALETTE:BEGIN skin=<skin>` marker to learn which skin applies, then works from that skin's full role set in `diagram-palette.json` (not only the roles that happen to sit inside the sentinel block), since F32 shows the corpus already keeps some roles as literals outside it.
- **Role-mapping selection rules** (§3.1 below): the diagram-specific replacement for the chart's `deriveTheme`/`chooseSurface`/`chooseInk`/`chooseSeries`/`chooseEmphasis` functions - reusing their `isBackground`/`isText`/`isChromatic`/luminance-ordering primitives, restructured around one accent instead of a four-series ladder, mechanically-derived hairlines, and a three-skin (not two-ground) frame.
- **Terminal conditional**: a single gate function testing declared dark support and neutral-row count before deriving `page`/`bar`/`paper`/`border`; when the gate fails, all nine terminal roles pass through unchanged from `diagram-palette.json`.
- **Whole-file literal remapping**: builds a `stockValue -> role` map from the selected skin's own roles in `diagram-palette.json` (mirroring `apply-diagram-tokens.cjs`'s `paintExample`'s `byValue` map), then replaces every matching literal in the file - inside the sentinel block and out - with the derived value. A literal matching no known role is refused by name.
- **Provenance writer**: rewrites the sentinel marker to `DIAGRAM_PALETTE:BEGIN skin=<skin> system=design-md` and inserts a provenance comment (`path=`, `sha256=`, `generator=`) directly beneath it, mirroring the chart's `CHART_PALETTE` provenance shape.
- **Gate-then-write staging**: every selected form's full derivation completes and clears its gates before any file is written; a single failure anywhere aborts the whole run with no output file, matching the chart script's all-or-nothing write.
- **`derivation-gates.cjs` extension**: the sentinel regex gains an optional ` system=<id>` group; a `system=design-md` block requires and validates its provenance comment, skips the value-equals-record check, and keeps every gate check; a block with no `system=` token is unchanged.

### 3.1 Role-Mapping Table

Every role `assets/color/diagram-palette.json` defines, across its three skins, the reference rows
that can fill it, and the stated fallback when none can. `isBackground`/`isText`/`isChromatic` and
luminance-ordering are the same primitives the chart script already applies to a parsed Colors
table; `light`/`dark` below mean "pick the lightest/darkest qualifying row", exactly as the chart's
own `chooseSurface`/`chooseInk` already do against the *same* full row pool for both grounds.

| Role | Skin(s) | Selection (reference rows that can fill it) | Fallback when none can |
|------|---------|----------------------------------------------|-------------------------|
| `paper` | light | Lightest row whose Role text names a background, surface, canvas, ground, panel or fill (`isBackground`) | Never fails - the lightest row of the whole table, since `parseColors` already requires 4+ usable rows |
| `paper` | dark | Darkest row by the same `isBackground` test, picked independently from the same table | Never fails - the darkest row of the whole table |
| `ink` | light | Darkest row whose Role text names text, foreground or ink (`isText`) | Never fails - the darkest row of the whole table |
| `ink` | dark | Lightest row by the same `isText` test | Never fails - the lightest row of the whole table |
| `muted` | light | The neutral (non-chromatic) text-tagged row nearest the `textOnPaper` gate (4.5:1) against light `paper`, excluding the row already used for `ink` | `ink` mixed toward `paper` by the least amount that clears 4.5:1 - a gate-anchored value, never an invented hue |
| `muted` | dark | Same rule, against dark `paper` and dark `ink` | Same fallback, mixed toward dark `paper` |
| `accent` | light | The single most-saturated chromatic row (saturation >= 24%) clearing `markOnPaper` (3.0:1) against light `paper` - one pick, since a diagram carries one mark colour, not a four-series ladder | The run fails by name; the stock 2.863:1 departure is never re-derived into a pass for a *themed* value |
| `accent` | dark | Same rule against dark `paper`, picked independently (the stock dark accent is hand-picked, not a lightness shift of the light one) | Same failure rule as light |
| `paper-2` | light only | The second-lightest background-tagged row after the one chosen for `paper` (or the second-lightest row overall, absent a background tag) | Collapses to equal `paper`; logged in the run's mapping output, never fabricated |
| `soft` | light only | A further neutral text-tagged row, one step lighter than the chosen `muted`; `soft` is a recorded departure (3.48:1) and is never held to the text gate, since it never carries text | `muted` mixed toward `paper` by a fixed, documented step - an explicit synthetic value, since `soft` gates against nothing |
| `rule` | light, dark | Derived, not selected: the chosen `ink`, held at alpha 0.12 | Never fails - no reference-row dependency |
| `rule-solid` | light, dark | Derived: the chosen `muted`, held at alpha 0.25 | Never fails |
| `accent-tint` | light | Derived: the chosen light `accent`, held at alpha 0.08 | Never fails |
| `accent-tint` | dark | Derived: the chosen dark `accent`, held at alpha 0.10 | Never fails |
| `link` | light only | A chromatic row whose Role text names link, anchor, interactive, or hyperlink text; absent that tag, the second most-saturated chromatic row after the one chosen for `accent`, provided it clears `markOnPaper` and sits >=30 degrees of hue from `accent` | Stays the stock hard-coded value, unthemed, and the run says so by name - a documented, common case, since a generic v3 Colors table rarely tags a dedicated link role |
| `backend-fill` | light only | A background-tagged row distinct from and lighter than the chosen `paper` (the stock value is near-white against an off-white `paper`) | Collapses to equal `paper`, logged rather than fabricated |
| `high-level-chevron` | light only | Not selected from the table at all: aliased to the chosen `ink` value, since D9 already scopes it to one diagram type and it carries no gate of its own | N/A - never fails |
| `series-1` … `series-5` | light only, opt-in | The chart's own greedy hue-distance selection (`chooseSeries`), widened from four slots to five: chromatic rows clearing `markOnPaper` taken by hue distance from what is already chosen, then neutral text tones darkest-first, `ink` held back last | A form declaring a `series-N` role fails by name (or is skipped with a note under `--all`) when fewer than five candidates clear (REQ-008) |
| `page`, `bar`, `paper`, `border` (terminal, as one group) | terminal | Only when the reference declares dark support AND supplies >=4 distinct neutral/background-tagged rows darker than the light `paper`: the four darkest such rows, ordered by luminance ascending, assigned `page` (darkest) -> `bar` -> `paper` -> `border` (lightest of the four) - mirroring the stock ordering `#0a0a0a -> #141414 -> #1b1b1b -> #2b2b2b` | The entire terminal skin stays 100% stock and the run states this by name; a request that explicitly selects a terminal-skinned form against a non-qualifying reference fails by name rather than silently falling back |
| `ink`, `muted`, `soft` (terminal) | terminal | Same rules as the dark skin's `ink`/`muted`/`soft` above, run against the terminal `paper` chosen above instead of the dark skin's `paper` | Same fallbacks as their dark-skin counterparts |
| `accent`, `accent-tint` (terminal) | terminal | Same rule as the dark skin's `accent`/`accent-tint` above, run against the terminal `paper` | Same failure/derivation rules |

**Where diagrams differ from the chart, stated plainly:**
- One accent, not four series plus emphasis - most diagram forms carry a single focal mark, so `accent` is one greedy pick, not a ladder with a separation gate between neighbours; `series-1..5` exists only for the minority of forms that draw a categorical set, and it is optional per form, not universal.
- Three skins, not two grounds - light and dark share one vocabulary (paper/ink/muted/accent) picked from the same table in opposite luminance directions, exactly as the chart already does for its own two grounds; terminal is a third, structurally different skin with no chart equivalent, and it is themed only when the reference actually supports a dark environment (§ terminal conditional above).
- No `--scheme` flag - D1 gives every form exactly one skin in one sentinel block, so there is no second ground for a flag to select the way the chart's dual-block forms need one.
- No ordered-form refusal - the diagram corpus carries no single-hue magnitude ramp the way the chart's `heat-matrix`/`bullet`/`calendar-grid` forms do, so `--all` never needs to skip a whole form for that reason; the one per-form refusal that exists is the series-capacity shortfall (REQ-008), which is form-specific, not corpus-wide.
- Whole-file literal remapping, not sentinel-only substitution - F32 already shows the shipped templates keep `link` (and, in `template-full.html`, `rule-solid`/`accent-tint`) as literals outside the sentinel block; the script maps every stock role value found anywhere in the file, the same mechanism `apply-diagram-tokens.cjs`'s `paintExample` already uses for the example corpus.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase's `research_intent` is capability addition, not `fix_bug`. It is filled here anyway
because the extension touches `derivation-gates.cjs`, a checker family every stock corpus form
already depends on for its own regression gate.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `scripts/apply-design-md.cjs` (new, producer) | Does not exist | Create - the diagram skill's first Style-Reference applicator | `node apply-design-md.cjs --default --all --out <dir>` prints `RESULT: PASSED` |
| `scripts/families/derivation-gates.cjs` (existing, modified) | Gates a stock `DIAGRAM_PALETTE:BEGIN skin=<skin>` block against byte-equality plus contrast | Extend - accept `system=design-md`, gate without byte-equality for that block only | Existing stock-drift mutation case still passes unchanged; two new cases pass for their own stated reason |
| `scripts/tests/mutation-cases.cjs`, `scripts/tests/fixtures/` (new cases, new fixture) | `derivation-gates` has one case today | Add two cases plus one fixture | `node --test scripts/tests/` includes both new cases and the completeness triple |
| `assets/color/diagram-palette.json` (read-only input) | The packet's token source and the identity `--default` must reproduce | Unchanged - this phase reads it, never edits it | `--default` byte-diff against the corpus (T018) |
| `assets/templates/`, `assets/examples/`, or `assets/diagrams/` (read-only input, whichever 009's state makes current) | The corpus this phase paints copies of | Unchanged - copies are written to `--out`, never in place | `git diff` over the source directory stays empty |
| `sk-design-chart/scripts/apply-design-md.cjs`, `references/design-md-theming.md`, `assets/style-reference/evilcharts/` (pattern source) | Read-only worked example | Not a consumer this phase - read for shape only, D12 hard block | `git diff` over `sk-design-chart/` stays empty (SC-006) |
| `SKILL.md` (existing, modified) | Documents user-facing capabilities only; internal tooling (`apply-diagram-tokens.cjs`, `check-diagram-corpus.cjs`) is deliberately unlisted | Add routing for the new user-facing capability, consistent with why the chart's own applicator is listed there and the diagram's internal repaint tool is not | `grep -n "design-md" SKILL.md` finds the new rows |

Required inventories:
- Same-class producers: `apply-diagram-tokens.cjs` is the only other script that writes a themed
  form copy; it is unchanged by this phase and remains the stock-palette path.
- Consumers of changed symbols: `check-diagram-corpus.cjs`'s `derivation-gates` family is the only
  consumer of the sentinel grammar this phase extends; the mutation suite is the only consumer of
  that family's exported behavior.
- Matrix axes: skin (light/dark/terminal) x role-kind (primary/derived/aliased/opt-in) - each cell
  above states its own selection rule and fallback rather than a shared default.
- Algorithm invariant: no form is written until every role it declares clears its gate; a single
  failing role anywhere aborts the whole run with no file written (REQ-010).
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
| Structural | v3 heading parser against a malformed reference (missing heading/table/substitute) | `node -e`, direct script invocation |
| Identity | `--default --all` against the full stock corpus | `diff -rq`, byte comparison |
| Unit (per-role) | Each role-mapping row against a real reference and a fixture mutation | `node --test scripts/tests/` |
| Mutation | Two new `derivation-gates` cases (missing provenance, gate-failing value) plus the existing stock-drift case | `node --test scripts/tests/corpus-mutations.test.cjs` |
| Regression | The untouched stock corpus | `node check-diagram-corpus.cjs` |
| Manual | Reading the mutation-suite output and the byte-diff loop for a hollow pass rather than trusting a green exit code | Human review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| 009's merged `assets/diagrams/` library | Internal | Yellow - 009 not yet authored/executed | T001 falls back to `assets/templates/`+`assets/examples/` and records the deviation (D13) |
| `assets/color/diagram-palette.json`, `scripts/color-gates.cjs` | Internal | Green - both exist on disk today | None; already read |
| `scripts/families/derivation-gates.cjs` | Internal | Green - exists on disk, this phase extends it | None; already read |
| `sk-design-chart/scripts/apply-design-md.cjs`, `references/design-md-theming.md`, `assets/style-reference/evilcharts/` (pattern source, read-only) | Internal | Green - all exist on disk today | None; already read |
| Node.js runtime, `node --test` | External | Green | None; the same runtime the packet's own suite already requires |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `--default` is found not to reproduce the stock corpus exactly, or the `derivation-gates` extension is found to weaken the stock byte-equality regression.
- **Procedure**: revert the phase's commits touching `scripts/apply-design-md.cjs`, `references/design-md-theming.md`, `assets/style-reference/diagram-stock/`, `scripts/families/derivation-gates.cjs`, `scripts/tests/mutation-cases.cjs`, `scripts/tests/fixtures/design-md-sample.html`, and `SKILL.md`. Nothing is deployed or migrated; a `git revert` of the phase's commit range is sufficient. The stock corpus and `diagram-palette.json` are untouched by this phase's rollback.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
009 state confirmed (T001) ──┐
Pattern-source read (T002-T004) ──┼──► Role-mapping build (T005-T016) ──► Stock reference fit (T017-T018)
                                    │
                                    └──► Checker extension + mutation cases (T019-T020) ──► SKILL.md + docs (T021-T022)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Role-mapping build |
| Role-mapping build | Setup | Stock reference fit |
| Checker extension | Role-mapping build's sentinel-writer shape | SKILL.md + docs |
| Verification | Stock reference fit, checker extension | Phase close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup (T001-T004) | Low | 1-2 hours |
| Implementation (T005-T022) | High | 10-14 hours |
| Verification (T023-T026) | Low-Medium | 1-2 hours |
| **Total** | | **12-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable; every artifact is git-tracked
- [ ] Feature flag configured - not applicable; no runtime feature ships from this phase
- [ ] Monitoring alerts set - not applicable; this is local tooling with no deployed surface

### Rollback Procedure
1. Stop touching `scripts/apply-design-md.cjs`, `references/design-md-theming.md`, `assets/style-reference/diagram-stock/`, `scripts/families/derivation-gates.cjs`, `scripts/tests/mutation-cases.cjs`, `scripts/tests/fixtures/design-md-sample.html`, and `SKILL.md`.
2. `git revert` the phase's commit range over those paths.
3. Confirm the stock corpus and `diagram-palette.json` are unaffected - this phase's rollback touches no `assets/templates/`, `assets/examples/`, or `assets/diagrams/` file.
4. Notify the operator and the 011 phase owner if 011 has begun reading this phase's output.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - no database, no persisted state beyond the git-tracked files themselves.
<!-- /ANCHOR:enhanced-rollback -->

---
