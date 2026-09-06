---
title: "Implementation Plan: Transfer the pointer mechanism to stacked-bars, daily-line and bar-line-composed"
description: "Copies the proven box-plot pointer excerpt into three templates unchanged, registering each form's own marks against its own readout, with a byte-delta measurement and a negative control per file."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Transfer the pointer mechanism to stacked-bars, daily-line and bar-line-composed

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Vanilla JavaScript, inline SVG and CSS custom properties, matching `box-plot.html` |
| **Framework** | None. Each file is self-contained static HTML with no build step |
| **Storage** | None |
| **Testing** | `node scripts/check-corpus.cjs` static analysis plus manual browser walks |

### Overview
Copies the excerpt phase 3 proves on `grouped-bars.html` into `stacked-bars.html`, `daily-line.html` and `bar-line-composed.html`, verbatim except for each file's own `id`, `TIP_ROWS` and registration calls. No drawing code, data or colour changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `003-excerpt-and-grouped-bars` reports `RESULT: PASSED` on `grouped-bars.html`
- [ ] The baseline `node scripts/check-corpus.cjs` run on the untouched three files is captured
- [ ] Pre-change copies of the three files exist outside the working tree, per `scripts/README.md`'s restore discipline

### Definition of Done
- [ ] `RESULT: PASSED` on all three files with zero `interaction-hygiene`, `interaction-state` and `number-format` failures
- [ ] Hover walk, pin walk, reduced-motion check and no-script check pass on all three forms
- [ ] Byte delta recorded per file
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Self-contained static SVG generation, no framework, mirroring `box-plot.html`.

### Key Components
- **CSS excerpt (`box-plot.html:124-150`)**: the opacity and transition rule for `[data-chart-tooltip]`, the `.tip-card`/`.tip-name`/`.tip-label`/`.tip-value` styling, the `:focus:not(:focus-visible)` hygiene line and the reduced-motion guard
- **Markup excerpt (`box-plot.html:161`)**: one empty `<g data-chart-tooltip id="tip-<form>">` per file, placed after `<desc>`
- **Card script (`box-plot.html:235-317`)**: `TIP_PAD`/`TIP_LINE`/`TIP_FLOOR`/`TIP_ROWS` constants, `tipNode`, `markable`, `openTip`, `closeTip`
- **Listener block (`box-plot.html:381-418`)**: the delegated `pointermove`/`pointerleave` pair plus the click-pin and `document` dismissal listeners
- **Per-form registration**: `stacked-bars.html:333-343` (segment print gate), `daily-line.html:328-331` (per-day dot), `bar-line-composed.html:382` and `:416` (column via `yCount`, dot via `yRate`)

### Data Flow
The card is a fixed DOM structure built once per file at load. Each mark's `markable()` call stores its name and rows in the `MARKS` map at build time. `pointermove` and `click` read that map through `mark.closest('[data-mark]')` and fill the same card elements. Nothing is computed at hover time beyond text and position.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase transfers an already-proven interaction excerpt into three templates. It is not a `fix_bug`, and it does not touch security, path handling, env precedence, schema boundaries, persistence, public responses or shared policy.
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
| Automated (checker) | `interaction-hygiene`, `interaction-state`, `number-format` and `motion` across all three files | `node scripts/check-corpus.cjs` |
| Manual (pointer) | Hover walk and pin walk per form: open on hover, flip near the right edge, tap to pin, tap elsewhere to dismiss | Browser, no network |
| Manual (degrade) | Reduced-motion check and no-script check per form | Browser accessibility settings, scripting disabled |
| Negative control | Misspell the reduced-motion guard selector on one file (for example `.tip` instead of `[data-chart-tooltip]`), confirm `motion` reports `RESULT: FAILED`, then restore and confirm `RESULT: PASSED` | `node scripts/check-corpus.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `003-excerpt-and-grouped-bars` | Internal, sibling phase | Must be Complete before this phase starts | Cannot safely copy an excerpt that is still changing |
| `005-stacked-area-pointed-band`, `006-daily-range-endpoints` | Internal, parallel siblings | Independent, disjoint files | None: no shared file, no shared code path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the three files fails `node scripts/check-corpus.cjs` after the excerpt is added, or a hover, pin, reduced-motion or no-script walk fails on any form.
- **Procedure**: `cp` the pre-change copy of the affected file back over it, never `git checkout --` since that discards uncommitted work per `scripts/README.md`, then rerun `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED` before retrying.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (confirm phase 3, capture baseline) ──► Implementation (3 forms) ──► Verification (per-form walks)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 3 Complete | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Medium | 3-4 hours across three forms |
| Verification | Medium | 2 hours: three per-form walks plus the checker runs |
| **Total** | | **6-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-change copies of the three files saved outside the working tree
- [ ] Baseline `RESULT: PASSED` captured
- [ ] No feature flag needed: these are static files, and the file itself is the deployed artifact

### Rollback Procedure
1. Restore the affected file from its pre-change copy with `cp`
2. Rerun `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED`
3. Repeat the form's hover, pin, reduced-motion and no-script walk to confirm parity with the pre-change file

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Only static template markup, CSS and script change, and no stored data is touched.
<!-- /ANCHOR:enhanced-rollback -->

---
