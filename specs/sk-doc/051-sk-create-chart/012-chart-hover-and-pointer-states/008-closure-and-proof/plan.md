---
title: "Implementation Plan: Prove the pointer contract, run the failure mutation, and close the packet's acceptance criteria"
description: "Runs the render check from the final state, executes the AC-006 mutation, walks the remaining criteria by hand, and writes the evidence into acceptance-criteria.md and the packet's completion metadata."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Closure and proof for the pointer contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CLI (`check-corpus.cjs`), headless Chrome via `--render`, manual browser walks |
| **Framework** | None. This phase produces evidence and markdown, not code |
| **Storage** | None |
| **Testing** | `node scripts/check-corpus.cjs --render`, one deliberate mutation, manual keyboard and no-script walks |

### Overview
This phase reads the finished corpus rather than changing it. It runs the render check, executes the one mutation AC-006 requires and restores it, walks the criteria the render check cannot see by hand, and writes every finding into `acceptance-criteria.md` and, where a criterion cannot be honestly met, into a decision record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001 through 007 each report `RESULT: PASSED` at their own final state
- [ ] Phase 001-register-and-contract's AC-005 disposition (restatement or waiver) exists and is located

### Definition of Done
- [ ] All 11 rows of `acceptance-criteria.md` read `Met`, `Waived` or `Superseded`
- [ ] The AC-006 mutation's `FAILED` and restored `PASSED` outputs are both recorded
- [ ] `spec.md`'s Status field and every other completion claim in the packet agree
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification and reporting. This phase designs nothing. Its output is evidence and two markdown documents.

### Key Components
- **`checkRenders`** (`scripts/check-corpus.cjs:1624`), the `--render` entry point that AC-007 names specifically.
- **`findBrowser`** (`scripts/check-corpus.cjs:1579`), which reads `CHROME_PATH` at `:1581` and, per `:1628-1629`, errors rather than silently skipping when no browser is found.
- **The `RESULT:` line** (`scripts/check-corpus.cjs:1793`), printed as `RESULT: FAILED` when any error was recorded and `RESULT: PASSED` otherwise. Read this line, not the exit code at `:1794`.
- **The AC-006 mutation recipe** (research.md section 5.2): add `data-chart-inert="every encoded value is printed beside its mark"` to `heat-matrix.html`'s root `<figure>`, which already carries `data-chart-tooltip`, and expect the contradiction branch to fire.
- **`checkCatalogResolves`** (`scripts/check-corpus.cjs:1514`), the strict-reading precedent research.md cites for the O3 decision, it already errors when a template on disk has no catalog row.
- **The `checkEmptyNotice` call-site comment** (`scripts/check-corpus.cjs:1748-1756`), the corpus's own cautionary history against an unverified exemption, which is why O3's answer must be a checked claim rather than an assumed one.
- **`data-chart-table` universality** (research.md section 1, verified by `grep -l data-chart-table assets/templates/*.html` returning 21 of 21), the structural fact the AC-002 keyboard walk relies on.

### Data Flow
No runtime code is produced. Evidence flows from the render run and the manual walks into `acceptance-criteria.md`'s Verification and Status columns, and, where a criterion cannot be met, into a new or existing decision record.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase does not originate from a bug fix or a deep-review verdict, and it touches no security, path-handling, env-precedence, schema, persistence, public-response or shared-policy surface. It mutates one template file once, on purpose, and restores it within the same task.
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
| Structural | `node scripts/check-corpus.cjs --render`, full corpus | Node, headless Chrome or `CHROME_PATH` |
| Negative control | The AC-006 mutation on `heat-matrix.html` | `cp`, manual edit, `node scripts/check-corpus.cjs` |
| Manual | Keyboard walk, one form per contract class | Browser, no mouse |
| Manual | No-script pass on the 13 tooltip-contract forms | Browser with JavaScript disabled |
| Manual | First-paint check on the heaviest form | Browser |
| Structural | External-resource grep for `src`, `href` and `import` | `rg` or `grep` |
| Structural | Byte-delta table, `wc -c` before and after per changed file | `wc` |

**Negative control, in full.** This is the AC-006 proof itself, not a separate exercise.
```
cp assets/templates/heat-matrix.html /tmp/keep.html
# add data-chart-inert="every encoded value is printed beside its mark"
# to heat-matrix.html's root <figure> element
node scripts/check-corpus.cjs   # expect RESULT: FAILED naming the contradiction branch
cp /tmp/keep.html assets/templates/heat-matrix.html
node scripts/check-corpus.cjs   # expect RESULT: PASSED
```
A run that never shows `RESULT: FAILED` here has not proven AC-006. The corpus's own `scripts/README.md` section 5 rule stands: a validator that has only ever passed is not evidence.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phases 001 through 007 | Internal | Green once each reports `RESULT: PASSED` | This phase has no final state to read |
| Phase 001-register-and-contract's AC-005 disposition | Internal | Must exist before this phase writes AC-005's row | AC-005 would otherwise be marked Met without evidence, which this phase is built to refuse |
| A headless Chrome or Chromium binary, or `CHROME_PATH` | External | Confirm before starting `--render` | `--render` errors rather than running, blocking AC-007's evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The AC-006 mutation fails to restore cleanly, or any criterion's evidence turns out to be wrong after the row was written.
- **Procedure**: Restore `heat-matrix.html` from its `/tmp` copy with `cp`, never `git checkout --`. If an `acceptance-criteria.md` row was written on evidence that later proves wrong, correct the row and its Verification cell rather than leaving the earlier claim in place, and note the correction in the Closure Statement.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Proof + Evidence) ──► Phase 3 (Verify + Reconcile)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001 through 007 landed | Proof |
| Proof | Setup | Verify |
| Verify | Proof | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Confirm every prior phase's final state |
| Core Implementation | Medium | One render run, one mutation, several manual walks, two documents written |
| Verification | Low | Re-read the finished `acceptance-criteria.md` for consistency |
| **Total** | | A single focused session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `/tmp` backup exists for `heat-matrix.html` before the AC-006 mutation
- [ ] No feature flag applies. This phase edits documentation and runs a checker
- [ ] No monitoring alert applies

### Rollback Procedure
1. Restore `heat-matrix.html` from its `/tmp` copy with `cp`.
2. Re-run `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED`.
3. Correct any `acceptance-criteria.md` row written on evidence that has since changed.
4. No stakeholder notification applies before the packet closes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
