---
title: "Implementation Plan: Give stacked-area a hover card naming the pointed band"
description: "Copies the same excerpt as phases 4 and 6 into stacked-area.html, registering the four existing band paths as marks and amending the contract row phase 1 wrote so the corpus's own documentation matches what was actually built."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Give stacked-area a hover card naming the pointed band

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
Copies the excerpt phases 4 and 6 also copy into `stacked-area.html`, registers the four existing band paths as marks rather than adding new geometry and amends the contract row phase 1 wrote so the corpus's own documentation matches what was actually built.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `003-excerpt-and-grouped-bars` reports `RESULT: PASSED` on `grouped-bars.html`
- [ ] Phase 1's `stacked-area` row already exists in `references/template-contract.md`
- [ ] Pre-change copies of `stacked-area.html` and `references/template-contract.md` exist outside the working tree

### Definition of Done
- [ ] `RESULT: PASSED` on `stacked-area.html` with zero `interaction-hygiene`, `interaction-state` and `number-format` failures
- [ ] Hover walk, pin walk, reduced-motion check and no-script check pass
- [ ] The `stacked-area` contract row reads the pointed-band readout, not the four-band-plus-total readout
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Self-contained static SVG generation, no framework, mirroring `box-plot.html`.

### Key Components
- **CSS excerpt (`box-plot.html:124-150`)**, **markup excerpt (`box-plot.html:161`)**, **card script (`box-plot.html:235-317`)** and **listener block (`box-plot.html:381-418`)**: the same excerpt phases 4 and 6 copy, unchanged
- **Band registration (`stacked-area.html:343-346`)**: `node('path', {...}, 'band ' + bandClass(s))` inside `runs.forEach`, wrapped with `markable()`
- **Total-across-period computation**: sum `DATA[i].values[s]` over every `i`, mirroring the per-month `Total` sum already built at `stacked-area.html:421`
- **Contract amendment**: `references/template-contract.md`, the `stacked-area` row phase 1 writes

### Data Flow
Each band's `markable()` call runs once at load and stores the band's name and its computed total in the `MARKS` map. `pointermove` and `click` resolve `e.target.closest('[data-mark]')` to the band path and open the card with that stored, fixed content. The card never recomputes a value while the pointer moves along the band.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase transfers an already-proven interaction excerpt into one template and amends one contract row to match. It is not a `fix_bug`, and it does not touch security, path handling, env precedence, schema boundaries, persistence, public responses or shared policy.
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
| Automated (checker) | `interaction-hygiene`, `interaction-state`, `number-format` and `motion` on `stacked-area.html` | `node scripts/check-corpus.cjs` |
| Manual (pointer) | Hover walk and pin walk, confirming the card's reported total does not change as the pointer moves along one band | Browser, no network |
| Manual (degrade) | Reduced-motion check and no-script check | Browser accessibility settings, scripting disabled |
| Negative control | Temporarily remove the `data-mark` attribute from one band's registration, confirm hovering that band opens no card, then restore it and confirm hovering opens the card naming that band. This proves registration, not proximity, drives the card | Browser, no network |
| Negative control | Misspell the reduced-motion guard selector, confirm `motion` reports `RESULT: FAILED`, then restore and confirm `RESULT: PASSED` | `node scripts/check-corpus.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `003-excerpt-and-grouped-bars` | Internal, sibling phase | Must be Complete before this phase starts | Cannot safely copy an excerpt that is still changing |
| Phase 1's `stacked-area` contract row | Internal, precedes this phase in ordering | Must exist in `references/template-contract.md` before the amendment task | The amendment task alone blocks. The build itself does not |
| `004-transfer-three-forms`, `006-daily-range-endpoints` | Internal, parallel siblings | Independent, disjoint files | None: no shared file, no shared code path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `stacked-area.html` fails `node scripts/check-corpus.cjs`, a walk fails, or the contract amendment leaves the document describing a card the build does not match.
- **Procedure**: `cp` the pre-change copy of `stacked-area.html` and of `references/template-contract.md` back over the working files, never `git checkout --`, then rerun `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (confirm phase 3 and phase 1's row, capture baseline) ──► Implementation (register bands, amend contract) ──► Verification (walks)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 3 Complete, phase 1's `stacked-area` row present | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Medium | 2-3 hours: one file, but the total computation is new logic rather than a plain copy |
| Verification | Medium | 1.5 hours |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-change copies of `stacked-area.html` and `references/template-contract.md` saved outside the working tree
- [ ] Baseline `RESULT: PASSED` captured
- [ ] No feature flag needed: these are static files, and the file itself is the deployed artifact

### Rollback Procedure
1. Restore both files from their pre-change copies with `cp`
2. Rerun `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED`
3. Repeat the hover, pin, reduced-motion and no-script walk to confirm parity with the pre-change file

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Only static template markup, CSS, script and one contract-document row change, and no stored data is touched.
<!-- /ANCHOR:enhanced-rollback -->

---
