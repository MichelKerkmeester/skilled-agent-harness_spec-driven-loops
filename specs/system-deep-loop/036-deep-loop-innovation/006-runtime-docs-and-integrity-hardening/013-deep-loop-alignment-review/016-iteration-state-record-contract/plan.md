---
title: "Implementation Plan: Phase 16: iteration-state-record-contract"
description: "Route the one reducer call site that bypassed its iteration-number helper through it, make the one run-only template write iteration, and correct the state documents, each change proven by a check that failed or would have failed before it."
trigger_phrases:
  - "iteration record fix plan"
  - "getIterationRun dashboard row"
  - "state record field migration"
  - "iteration contract verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: iteration-state-record-contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS reducers, YAML command templates, Markdown references |
| **Framework** | Vitest for the deep-loop runtime suite |
| **Storage** | Append-only JSONL state logs |
| **Testing** | Vitest; `compile-command-contracts.cjs` for contract freshness; `validate_document.py` for references |

### Overview
Map every writer and reader of the iteration-number field first, because the change is only correct if no reader is left expecting the old name. Then change the smallest set that makes an `iteration`-only record work end to end: one reducer line that bypassed an existing helper, one template that wrote `run` alone, and the documents that told writers to use `run`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The canonical field is decided (`iteration`, operator, 2026-09-16)
- [x] Every writer and reader of the field is inventoried
- [x] No fan-out run is active in this checkout and no changed file has uncommitted edits from another session

### Definition of Done
- [x] The regression test fails before the reducer change and passes after it
- [x] The compiled contract is fresh against the changed template
- [x] The four documents validate with 0 issues
- [x] The full runtime suite shows no failure caused by this change
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Canonical field with a tolerated legacy alias. Readers resolve the number through a helper that prefers `iteration` and falls back to `run`, so old logs keep working while new records write the canonical name.

### Key Components
- **`getIterationRun()`** in the review reducer: the helper the dashboard row now uses.
- **`readIterationNumber()`** in the research reducer: already accepts both names; unchanged.
- **`retainIterationRecords()`** in the fan-out runner: the validator that accepts only `iteration`; unchanged.

### Data Flow
A lane appends an iteration record to the state log. The fan-out runner validates forced depth from `iteration`. The reducers read the number through their helpers to build the registry, strategy and dashboard.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/scripts/reduce-state.cjs` dashboard progress row | Renders each iteration's number | Update: read through `getIterationRun()` | Regression test fails before, passes after |
| `runtime/scripts/reduce-state.cjs` blocked-stop heading | Renders a `blocked_stop` event's `run` | Unchanged: events keep `run` | Built by `buildBlockedStopHistory()` from event records |
| `runtime/scripts/fanout-run.cjs` forced-depth validator | Accepts only `iteration` | Unchanged: already canonical | `retainIterationRecords()` reads `record.iteration` |
| `deep-research/scripts/reduce-state.cjs` | Research reducer | Unchanged: `readIterationNumber()` accepts both; the suppressed-candidate `run` has no reader | Search for readers of the candidate's `run` returns none |
| `verify-iteration.cjs`, `fanout-merge.cjs`, `legacy-shadow.ts` | Other readers | Unchanged: accept both names | Each reads `run ?? iteration` or either |
| `deep-research-auto.yaml` error record | Writer | Update: add `iteration` beside `run` | Run-only writer search flags it before, finds nothing after |
| Agent and prompt-pack templates | Writers | Unchanged: already write `iteration` | Same search |
| State documents and two reference examples | Contract | Update: `iteration` required, `run` legacy | `validate_document.py` 0 issues |
| 36 test fixtures that write `run` only | Legacy-path coverage | Unchanged: they prove old logs still read | Counted by the same search over test files |

Required inventories:
- Same-class producers: every template, agent, code file and document that writes an iteration record, searched with a multi-line matcher whose control run flags the pre-change template.
- Consumers of the changed field: every non-test read of `run` or `iteration` across `system-deep-loop`.
- Matrix axes: record carries `iteration` only, `run` only, both, or neither.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Inventory** every writer and reader of the field.
2. **Baseline** the two reducer suites and the compiled contract's freshness.
3. **Negative control:** add the regression test and watch it fail.
4. **Change** the reducer line, the template and the documents; regenerate the contract.
5. **Verify** with the reducer suites, the full runtime suite, contract freshness, document validation, comment hygiene and the derived-state checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | `iteration`-only record renders its number in the dashboard | Vitest, `deep-review-state-reducer.vitest.ts` |
| Suite | The two reducer suites, then the whole runtime suite | Vitest |
| Freshness | Compiled contract against the changed template | `compile-command-contracts.cjs` dry run compared byte for byte |
| Documents | The four changed references | `validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator decision on the canonical field | Decision | Taken | No change could be scoped |
| A quiet main checkout | Environment | Confirmed | Another session's fan-out containment could revert the edits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A reader is found that needs `run` on an iteration record and the helper does not cover it.
- **Procedure**: `git checkout -- <the eight changed files>` before commit, or `git revert <commit>` after, then re-run `compile-command-contracts.cjs --command deep/research --write` so the contract hash matches the restored template.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | Operator decision | Baseline |
| Baseline | Inventory | Negative control |
| Negative control | Baseline | Change |
| Change | Negative control | Verify |
| Verify | Change | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Medium | The bulk of the work |
| Change | Low | One line, one token, four documents, one test |
| Verify | Medium | Dominated by the full suite's runtime |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration; state logs are read-compatible in both directions
- [x] No feature flag needed; the legacy alias keeps old logs working

### Rollback Procedure
1. Revert the eight files.
2. Regenerate the deep-research compiled contract.
3. Re-run the two reducer suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
