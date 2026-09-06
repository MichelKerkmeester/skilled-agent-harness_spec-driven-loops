---
title: "Implementation Plan: Bring the six chart deliveries to parity with their parent templates' pointer contracts"
description: "Copies the pointer-interaction code three parent templates already ship, and the code phase 004 lands in a fourth, into their corresponding deliveries, then declares the remaining two deliveries inert with their parent's own stated reason."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deliveries to parity with their parent templates' pointer contracts

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Vanilla HTML, CSS and JavaScript inside self-contained files, no framework, no build step |
| **Framework** | None. Each chart is one file that opens with no network |
| **Storage** | None |
| **Testing** | `node scripts/check-corpus.cjs --render`, manual browser walks with and without scripting |

### Overview
Three of the four transfers copy a tooltip mechanism that already exists, identical in shape, inside `heat-matrix.html`, `distribution-strip.html` and `scatter.html`. The fourth copies the mechanism phase 004-transfer-three-forms lands in `daily-line.html`. Each copy is adapted to the delivery's own mark-creating call and its own data, not rewritten. The remaining two deliveries gain a one-attribute declaration copied from their own parent template.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 004-transfer-three-forms, 005-stacked-area-pointed-band and 006-daily-range-endpoints report `RESULT: PASSED` at their own final state
- [ ] Phase 002-annotate-inert-forms has landed the reason strings on `unit-grid.html` and `bar-rows.html`
- [ ] A `/tmp` copy exists of every file this phase edits, before the first edit

### Definition of Done
- [ ] All success criteria this phase closes (SC-001 through SC-004) are observed, not asserted
- [ ] `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the changed corpus
- [ ] `spec.md` and `tasks.md` reflect the actual files touched
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Transfer and adapt. No new mechanism is designed here. The pattern is the one research.md section 6 documents, and the one already live in three shipped templates.

### Key Components
- **`heat-matrix.html` tooltip block, source for `calls-by-day-and-hour.html`**: CSS at `heat-matrix.html:138-156` (`[data-chart-tooltip]` rule through the reduced-motion guard), the empty markup group at `:169` (`<g data-chart-tooltip id="tip-heat-matrix">`), the card builder at `:258-296` (`TIP_PAD` through `markable`), `openTip`/`closeTip` at `:298-331`, the listeners at `:487-518`, and the mark-registration call at `:399`.
- **`distribution-strip.html` tooltip block, source for `pick-times-by-depot.html`**: the same shape at `:126-145`, markup group at `:157`, `TIP_ROWS` at `:256`, `openTip` at `:293`, `closeTip` at `:324`, `markAt` at `:393`, listeners at `:397-421`.
- **`scatter.html` tooltip block, source for `van-age-against-repair-cost.html`**: CSS at `:127-143`, markup group at `:155`, `TIP_ROWS` at `:247` (this one reads `2`, a two-row readout, unlike the other two donors), `openTip` at `:284`, `closeTip` at `:315`, `markAt` at `:408`, listeners at `:412-436`.
- **`daily-line.html` tooltip block, source for `orders-after-the-price-change.html`**: does not exist yet. Once phase 004-transfer-three-forms lands it, it follows the same four-part shape (research.md section 6.6: `TIP_ROWS = 1`, the day's value as the single row).
- **The two inert declarations**: read the exact attribute value phase 002-annotate-inert-forms writes into `unit-grid.html` and `bar-rows.html`, and copy it verbatim into `where-the-budget-went.html` and `staff-hours-by-service.html`. Do not restate the reason in different words.

### Data Flow
Each delivery's own drawing and data code is untouched. Every transfer adds the same four blocks in the same four places the pattern already uses: a style block, one empty `<g data-chart-tooltip>`, the script constants and card builder, and the listeners appended after the drawing finishes. The delivery's own mark-creating call, inside its own drawing loop, gets wrapped in `markable(...)` the way `box-plot.html:273-274` wraps its own.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase does not originate from a bug fix or a deep-review verdict, and it touches no security, path-handling, env-precedence, schema, persistence, public-response or shared-policy surface. It edits six static, self-contained HTML files and one paragraph of reference documentation.
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
| Manual | Hover, pin and dismiss walk on each of the four transferred deliveries | Browser, no network |
| Manual | Scripting-disabled read on all six deliveries | Browser with JavaScript off |
| Structural | `node scripts/check-corpus.cjs --render` over the full corpus | Node, headless Chrome or `CHROME_PATH` |
| Negative control | Empty-reason mutation on `where-the-budget-went.html`, proving the checker reads examples and not only templates | `cp`, manual edit, `node scripts/check-corpus.cjs` |

**Negative control, in full.** `cp assets/examples/where-the-budget-went.html /tmp/keep.html`, add `data-chart-inert=""` (an empty value) to its root `<figure>`, run `node scripts/check-corpus.cjs` and expect `RESULT: FAILED` naming the empty-reason branch on that file specifically. Restore with `cp /tmp/keep.html assets/examples/where-the-budget-went.html` and run again, expecting `RESULT: PASSED`. A checker that never shows `RESULT: FAILED` here has not proven the new register is enforced on deliveries, only on templates.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phases 004, 005, 006 (siblings, this parent) | Internal | Green once each reports `RESULT: PASSED` | `orders-after-the-price-change.html` has no card to copy from `daily-line.html` |
| Phase 002-annotate-inert-forms | Internal | Green once `unit-grid.html` and `bar-rows.html` carry their reason strings | The two inert declarations in this phase would restate rather than copy the reason |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the six edited files fails to reach `RESULT: PASSED`, or a manual walk shows a card opening on the wrong mark, failing to flip at an edge, or failing to pin and dismiss on tap.
- **Procedure**: Restore the affected file from its `/tmp` copy with `cp`, never with `git checkout --`, which reverts to the last commit rather than the working state and would discard any uncommitted work in the tree. Re-run `node scripts/check-corpus.cjs --render` and confirm `RESULT: PASSED` before retrying the edit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Transfers + Declarations) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 004, 005, 006 and 002 landed | Transfers |
| Transfers | Setup | Verify |
| Verify | Transfers | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Confirm dependencies, copy six files aside |
| Core Implementation | Medium | Four transfers plus two declarations plus one paragraph |
| Verification | Low | One render run, one negative control, six manual walks |
| **Total** | | A single focused session, no multi-day work implied |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `/tmp` backup exists for each of the six files and for `references/template-contract.md`
- [ ] No feature flag applies. These are static files with no runtime configuration
- [ ] No monitoring alert applies. Verification is the render run and the manual walks

### Rollback Procedure
1. Stop editing the file that failed its check.
2. Restore it from its `/tmp` copy with `cp`.
3. Re-run `node scripts/check-corpus.cjs --render` and confirm `RESULT: PASSED`.
4. No stakeholder notification applies. This phase has no deployed audience until the packet closes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
