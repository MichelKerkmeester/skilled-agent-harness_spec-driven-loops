---
title: "Implementation Plan: Phase 7: manual-review-remediation"
description: "Fix all 34 manual-review findings (F1-F34) at their current file and line, each resolved to a role its file's skin already declares, verified lane by lane."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: manual-review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Hand-authored HTML/SVG with inline CSS custom properties (the corpus itself); Node.js/CommonJS for every verification tool this phase reads through |
| **Framework** | None; no templating engine, no DOM library introduced |
| **Storage** | Flat files only: 31 corpus HTML files, one JSON exemption list, one markdown record |
| **Testing** | `node scripts/check-diagram-corpus.cjs` for the corpus gate, `node --test scripts/tests/` for the mutation suite, `node scripts/color-gates.cjs` for contrast, `render-screenshots.cjs` for the view-before-ticket gate this phase practices |

### Overview
This phase repairs the 34 numbered defects 006's manual review found across 31 files (27 examples,
4 templates) plus one palette exemption and one derivation-record sentence, each corrected to the
value the file's own comment, caption or catalog row already claims, at today's paths. No systemic
doctrine work (008), no path merge (009), no new checker family (005 already shipped ten).
Execution runs on DeepSeek V4.1 Flash at max thinking through cli-pi and llmgateway, one lane per
dispatch, each brief carrying the exact file, the exact line and the exact replacement (D15);
verification runs entirely on the conductor's side, never the executor's.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `006-capture-and-judgment/scratch/evidence/manual-review-opus.md` exists and its 34 findings are read in full
- [ ] `check-diagram-corpus.cjs` and `scripts/tests/` (005) print `RESULT: PASSED` against the pre-remediation corpus — the baseline this phase must not regress
- [ ] `color-gates.cjs`, `apply-diagram-tokens.cjs` and `diagram-palette.json` (002/003) are confirmed on disk, since every colour fix and the byte-identical guarantee route through them

### Definition of Done
- [ ] All 37 rows in `acceptance-criteria.md` are `Met`, `Waived` or `Superseded`
- [ ] `check-diagram-corpus.cjs` prints `RESULT: PASSED` against the fully remediated corpus
- [ ] `apply-diagram-tokens.cjs --default` and `--default --examples` reproduce every file byte for byte
- [ ] `node --test scripts/tests/` passes and `grid-baseline.json`'s counts hold or fall
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-file surgical patch against a fixed line and attribute target, not a rewrite — the same shape
every prior repaint in this packet has used (002's derivation fixes, 003's sentinel ports, 004's
repaint). Findings are grouped into seven dispatch lanes (one P1 pair plus six thematic lanes), not
one dispatch per finding, so a reader judging a lane judges one mental model at a time.

### Key Components
- **The lane dispatch**: the P1 pair (F1, F2) first, then geometry-and-overdraw, legend-fidelity,
  colour-and-contrast, meaning-versus-catalog, skin-and-token-hygiene, and polish — six lanes
  covering the 28 P2s and 4 P3-numbered findings, each one conductor-composed brief carrying the
  exact file, line and replacement (D15).
- **The measurement step**: `scripts/color-gates.cjs` re-run after every colour-lane edit, since a
  "close enough" hex is exactly the failure mode F23's own measured facts warn against (white text
  at 2.70:1 on the TB chip, 2.90:1 for white and 4.44:1 for ink — neither settles it alone).
- **The view gate**: every changed file re-rendered through `render-screenshots.cjs` and looked at
  before its task closes (REQ-011) — this phase's own local discipline, not a new checker family.
- **The regression triple**: `check-diagram-corpus.cjs`, `apply-diagram-tokens.cjs --default`
  (both flag combinations) and `node --test scripts/tests/`, re-run after every lane, not only once
  at the end, since a later lane's edit could silently regress an earlier lane's fix.

### Data Flow
The conductor composes one brief per lane from the review's own "Fix:" text and the live file's
current lines (re-confirmed on disk immediately before dispatch, since an earlier lane's edit can
shift line numbers within the same file), dispatches it to DeepSeek V4.1 Flash via cli-pi and
llmgateway, receives the edited file(s) back, re-renders and views each changed file, re-runs the
regression triple, and only then marks that lane's tasks `[x]`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase's `research_intent` is `fix_bug`: every task repairs a confirmed, numbered defect the
manual review found. This section is filled for that reason.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 31 corpus HTML files (producer) | Each carries the numbered defect the review found | Modify — patch the cited line/attribute to the value the file's own comment, caption or catalog row already claims | Re-render + view; the finding's own check (contrast measure, grep count, visual read) |
| `assets/color/diagram-palette.json` (producer, F26) | Lists `example-sequence-oauth-dark.html` under `untokenized`, though it carries the recorded dark skin exactly | Modify — delete the entry | `grep -c untokenized` reports 0; `derivation-gates` now covers the file |
| `references/foundations/derivation-record.md` §1 (producer, F26) | Names the exemption in prose | Modify — delete the sentence | `grep` for the sentence reports 0 |
| `scripts/check-diagram-corpus.cjs` (consumer, unchanged) | Gates the corpus post-fix | Unchanged — read as the final gate, not edited | `RESULT: PASSED` after every lane |
| `scripts/color-gates.cjs` (consumer, unchanged) | Measures every colour-lane fix | Unchanged — read through, not edited | Contrast reports for F17, F22, F23, F30 |
| `scripts/apply-diagram-tokens.cjs` (consumer, unchanged) | Re-derives every literal from the sentinel block | Unchanged — the byte-identical guarantee (REQ-009) is this phase's own regression gate | `diff -rq` empty for `--default` and `--default --examples` |
| `references/catalog.md` (consumer, F8/F28/F29 touch what it promises) | States the per-file catalog question each fix must now actually answer | Unchanged content, unless a fix narrows a question instead of drawing it (F28/F29's stated alternative) | `catalog-bidirectional` family output; a direct read against the row's own wording |
| `scripts/tests/` mutation suite (consumer, unchanged) | Exercises the ten families this phase's fixes must keep honest | Unchanged — a fix that breaks a family's fixture assumption would surface here | `node --test scripts/tests/` |
| 008-doctrine-reconciliation (future consumer) | Owns S1-S10, the systemic patterns this phase does not touch | Not a consumer this phase | N/A this phase |
| 009-one-form-library (future consumer) | Merges these same 31 files' paths after this phase fixes their content | Not a consumer this phase — content-only work, no path change | N/A this phase |

Required inventories:
- Same-class producers: `rg -n 'fill="#7a8399"' assets/examples assets/templates` finds the ten
  `soft`-as-text instances S2 already tracks; F17 and F22 are two of them, and the other eight stay
  008's job since S2 is a systemic pattern, not a numbered finding this phase owns.
- Consumers of changed symbols: `rg -n 'untokenized' assets/color/diagram-palette.json references/foundations/derivation-record.md`
  — the only two files naming the exemption F26 removes.
- Matrix axes: finding (34) × lane (7: the P1 pair plus six P2/P3 lanes) is a single-membership
  mapping, not a cross product — every finding belongs to exactly one lane.
- Algorithm invariant: no fix may introduce a colour literal that is not already a role of its
  file's skin (REQ-009); the applicator's byte-for-byte re-derivation is the invariant, re-checked
  after every lane, not only at the end.
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
| Structural | Post-fix render for each of the 31 changed files | `render-screenshots.cjs`, human view |
| Contrast | Every colour-lane fix (F17, F22, F23, F30) | `scripts/color-gates.cjs` |
| Corpus | The whole corpus after every lane | `scripts/check-diagram-corpus.cjs` |
| Regression | The ten checker families, byte-for-byte applicator reproduction, grid-baseline non-regression | `node --test scripts/tests/`, `apply-diagram-tokens.cjs --default[,--examples]` |
| Manual | The view-before-ticket gate (REQ-011) | Human/conductor review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 005's checker + mutation suite | Internal | Green — shipped | Every post-fix gate in this phase depends on it |
| 002's derivation record + 003's `color-gates.cjs`/`apply-diagram-tokens.cjs` | Internal | Green — shipped | Every colour fix and the byte-identical guarantee depend on them |
| 006's `manual-review-opus.md` | Internal | Green — the fact base | Every task's fix and check are drawn from it |
| `render-screenshots.cjs` / headless Chrome | Internal | Green — shipped | The view-before-ticket gate depends on it |
| Node.js runtime | External | Green | Unchanged |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a shipped fix is later found to have introduced a new colour literal, broken the
  byte-for-byte guarantee, or regressed a checker family.
- **Procedure**: `git revert` the phase's commits touching the named file(s); the pre-remediation
  corpus (005's own dress-run baseline) is the known-good fallback; re-run
  `check-diagram-corpus.cjs` and `node --test scripts/tests/` to confirm the revert restored it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T003) ──► P1 fixes (T004-T005) ──► Lane dispatches (T006-T037) ──► Verification (T038-T042)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | P1 fixes |
| P1 fixes | Setup | Lane dispatches |
| Lane dispatches | P1 fixes | Verification |
| Verification | Lane dispatches | 008's own start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| P1 fixes | Low | 1-2 hours |
| Lane dispatches (32 findings across 6 lanes) | High | 8-14 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **12-20 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — not applicable; every artifact is git-tracked
- [ ] Feature flag configured — not applicable; no runtime feature ships from this phase
- [ ] Monitoring alerts set — not applicable; the CI workflow's own run history is the monitoring surface

### Rollback Procedure
1. Stop touching the named file(s) for the lane in question.
2. `git revert` the phase's commit range over the 31 corpus files, `diagram-palette.json` and `derivation-record.md`.
3. Re-run `check-diagram-corpus.cjs` and `node --test scripts/tests/`, confirming the revert restored the pre-remediation baseline.
4. Notify the operator and the 008/009 phase owners, since both read this phase's fixed corpus as their own starting state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — no database, no persisted state beyond the git-tracked files themselves.
<!-- /ANCHOR:enhanced-rollback -->

---
