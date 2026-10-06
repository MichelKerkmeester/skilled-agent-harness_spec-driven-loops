---
title: "Implementation Plan: Review gateway accepts the canonical iteration record"
description: "Three DeepSeek dispatch units: register a deep_review.iteration_recorded stem that carries the record whole and projects it back unchanged, make append-mode-event.cjs wrap a bare review iteration record under it, and compare canonical event bytes directly so a record over 10 KB is not refused."
trigger_phrases:
  - "review gateway iteration plan"
  - "iteration_recorded stem plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Review gateway accepts the canonical iteration record

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (runtime lib), CommonJS (gateway script) |
| **Framework** | system-deep-loop typed event ledger |
| **Storage** | Append-only ledger frames plus the legacy JSONL projection |
| **Testing** | vitest, `npm run typecheck` |

### Overview
The review ledger gets one new stem whose data is the record under a single `record` key, wired into every table `deep_review.iteration_error` sits in. The state projection unwraps it into the record itself. The gateway, in review mode only, wraps a bare `type:"iteration"` object under that stem instead of refusing it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Failure reproduced: the gateway exits 1 on the canonical record in review mode
- [x] Every registration site of a review stem mapped
- [x] Five real records from the 2026-10-02 hook review checked against the forbidden-field rule (none trips it)

### Definition of Done
- [x] All acceptance criteria met
- [x] Typecheck clean; affected suites show no new failure
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Append-only ledger with typed stems, projected into a legacy JSONL file.

### Key Components
- **`deep-review-ledger-types.ts` / `-schema.ts`**: the stem table, census, wire types and data rules.
- **`deep-review-state-contract.ts`**: the projection the reducer reads.
- **`append-mode-event.cjs`**: the one writer every workflow uses.

### Data Flow
Worker → record file → gateway wraps under the stem → ledger frame → projection unwraps → `deep-review-state.jsonl` row equal to the record.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Review stem tables (types, schema) | Registry | Add the stem last | Schema suite; sealed-artifact indices unchanged |
| Review reducer | Routes every stem | Add beside iteration_error | Typecheck exhaustiveness |
| State projection | Writes legacy rows | Unwrap the record | State-contract test |
| Gateway | Only writer | Wrap the bare record in review mode | CLI test end to end |
| Producer census | Holds spoken stems to emitters | Count one more | Census suite |
| Agent, prompt template, workflow YAML | Tell the worker the shape | Unchanged | They already describe it |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Schema fixture, projection unwrap | vitest |
| Integration | Gateway CLI: record in, identical row out; non-iteration row still refused | vitest |
| Manual | A real iteration record from the hook review through the gateway | node |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode-go DeepSeek V4.1 Flash | External | Green | Fall back to asking the operator |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite outside the baseline failures goes red.
- **Procedure**: Revert the worktree's changes; nothing outside this branch is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| G1 register the stem | None | G2 |
| G2 gateway wrap | G1 | G3 |
| G3 compare canonical bytes directly | G2 (found by the real-record check) | Verify |
| Verify | G2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done |
| Core Implementation | Med | Three dispatches |
| Verification | Low | Targeted suites plus a real record |
| **Total** | | **Three dispatches plus checks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Nothing deploys: the change reaches sessions only after merge to main

### Rollback Procedure
1. Revert the branch.
2. Existing ledgers stay readable: no stem is removed or renumbered.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
