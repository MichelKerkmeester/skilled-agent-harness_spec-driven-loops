---
title: "Implementation Plan: Give daily-range its first pointer contract, low and high, never a midpoint"
description: "Copies the excerpt into daily-range.html, the one form in this trio with no interaction register today, adds the focus-ring hygiene line it is missing and registers each drawable bar with two fixed rows, low and high, never a midpoint."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Give daily-range its first pointer contract, low and high, never a midpoint

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Vanilla JavaScript, inline SVG and CSS custom properties, matching `box-plot.html` |
| **Framework** | None. The file is self-contained static HTML with no build step |
| **Storage** | None |
| **Testing** | `node scripts/check-corpus.cjs` static analysis plus manual browser walks |

### Overview
Copies the excerpt into `daily-range.html`, the one form in this trio that carries no interaction register today. It also gains the `:focus:not(:focus-visible)` hygiene line and registers each drawable day's bar with two fixed rows, low and high, never a midpoint.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `003-excerpt-and-grouped-bars` reports `RESULT: PASSED` on `grouped-bars.html`
- [ ] The baseline `node scripts/check-corpus.cjs` run on the untouched file is captured
- [ ] A pre-change copy of `daily-range.html` exists outside the working tree

### Definition of Done
- [ ] `RESULT: PASSED` on `daily-range.html` with zero `interaction-hygiene`, `interaction-state` and `number-format` failures
- [ ] Hover walk, pin walk, reduced-motion check and no-script check pass
- [ ] Deleting the hygiene line alone makes `interaction-hygiene` fail, proving the line is doing work
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Self-contained static SVG generation, no framework, mirroring `box-plot.html`.

### Key Components
- **CSS excerpt (`box-plot.html:124-150`)**: includes the `.figure svg :focus:not(:focus-visible) { outline: none; }` line `daily-range.html` is missing today, verified by zero occurrences
- **Markup excerpt (`box-plot.html:161`)**: one empty `<g data-chart-tooltip id="tip-daily-range">`, placed after `<desc>`
- **Card script (`box-plot.html:235-317`)**: `TIP_ROWS = 2`
- **Listener block (`box-plot.html:381-418`)**: the same delegated pair and click-pin and document-dismissal listeners as every other transfer
- **Bar registration**: `daily-range.html:263-264` (`node('rect', { x, y: y(d.high), width, height: y(d.low) - y(d.high), ... })`), wrapped with `markable()`, rows `[['Low', fmt(d.low)], ['High', fmt(d.high)]]`
- **Drawable filter**: `daily-range.html:261` (`if (drawable.indexOf(d) === -1) return;`). Only a drawn bar gets a mark

### Data Flow
Each bar's `markable()` call runs once at build time and stores its two fixed rows, low and high, in the `MARKS` map. `pointermove` and `click` resolve to the bar element and open the card with that stored content. No value is computed or averaged at hover time.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase transfers an already-proven interaction excerpt into one template. It is not a `fix_bug`, and it does not touch security, path handling, env precedence, schema boundaries, persistence, public responses or shared policy.
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
| Automated (checker) | `interaction-hygiene`, `interaction-state`, `number-format` and `motion` on `daily-range.html` | `node scripts/check-corpus.cjs` |
| Manual (pointer) | Hover walk and pin walk, confirming the card shows two labelled rows, Low and High, and never a single midpoint or average figure | Browser, no network |
| Manual (degrade) | Reduced-motion check and no-script check | Browser accessibility settings, scripting disabled |
| Negative control | Delete the hygiene line alone, run the checker, confirm `interaction-hygiene` reports `RESULT: FAILED` naming `daily-range.html`, then restore the line and confirm `RESULT: PASSED`. This is the proof `research/phase-recommendation.md` PHASE 6 names directly | `node scripts/check-corpus.cjs` |
| Negative control | Misspell the reduced-motion guard selector, confirm `motion` reports `RESULT: FAILED`, then restore and confirm `RESULT: PASSED` | `node scripts/check-corpus.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `003-excerpt-and-grouped-bars` | Internal, sibling phase | Must be Complete before this phase starts | Cannot safely copy an excerpt that is still changing |
| `004-transfer-three-forms`, `005-stacked-area-pointed-band` | Internal, parallel siblings | Independent, disjoint files | None: no shared file, no shared code path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `daily-range.html` fails `node scripts/check-corpus.cjs` after the register and hygiene line are added, a walk fails, or the card ever shows a midpoint.
- **Procedure**: `cp` the pre-change copy of `daily-range.html` back over it, never `git checkout --`, then rerun `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (confirm phase 3, capture baseline) ──► Implementation (register + hygiene line) ──► Verification (walks)
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
| Core Implementation | Medium | 2-3 hours: one file with two additions, the register and the hygiene line |
| Verification | Medium | 1.5-2 hours, including the deliberate hygiene-line-removal proof |
| **Total** | | **4-5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-change copy of `daily-range.html` saved outside the working tree
- [ ] Baseline `RESULT: PASSED` captured
- [ ] No feature flag needed: this is a static file, and the file itself is the deployed artifact

### Rollback Procedure
1. Restore `daily-range.html` from its pre-change copy with `cp`
2. Rerun `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED`
3. Repeat the hover, pin, reduced-motion and no-script walk to confirm parity with the pre-change file

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Only static template markup, CSS and script change, and no stored data is touched.
<!-- /ANCHOR:enhanced-rollback -->

---
