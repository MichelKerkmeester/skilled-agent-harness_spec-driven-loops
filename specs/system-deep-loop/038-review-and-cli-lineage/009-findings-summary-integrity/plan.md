---
title: "Implementation Plan: Phase 9: findings-summary-integrity"
description: "Accept findingId in the reducer's delta intake and make the summary fallback cumulative-aware, tests first, then regenerate the affected registry."
trigger_phrases:
  - "findings summary integrity plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: findings-summary-integrity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | Review folder files; append-only state log read only |
| **Testing** | `node --test` deep-review script tests |

### Overview
Two changes in `reduce-state.cjs`: the delta intake reads `findingId` when `id` is absent, and the summary fallback counts every finding active by the run when the summary is the running total. Review follow-ups added a matching change in `verify-iteration.cjs` (its delta enumeration reads `findingId`) and a merged main and delta scan for resolved ids. Tests come first, then the reducer reruns on the relaunch-loop review folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (AC-001 to AC-007 Met, see acceptance-criteria.md)
- [x] Tests passing (summary-fallback test 1/1, verify-iteration vitest 31/31)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A pure reducer over append-only records.

### Key Components
- **`deltaRecordToFinding`**: turns a delta row into a registry finding.
- **`fallbackFindingsFromIterationRecord`**: pads findings an iteration summary counts but no other source lists.

### Data Flow
Deltas and iteration records are read, delta findings are upserted, and runs without delta findings fall back to their iteration record's details and summary counts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deltaRecordToFinding` | Delta intake | Update: `findingId` alias | Alias test |
| `fallbackFindingsFromIterationRecord`, `countFindingsSeenInRun` | Summary padding | Update: cumulative-aware count | Cumulative and per-run tests |
| `verify-iteration.cjs` | Delta finding enumeration | Update: a row keyed `findingId` enumerates as one keyed `id` does (lines 200 and 205) | Vitest cases `review-delta-finding-id` and `review-delta-no-id-key` |
| `resolvedIdsSeenByRun`, `resolvedIdSet` | Resolved-id scans | Update: merged main and delta iteration records, iteration-type guard, comment at `summaryIsCumulative` | Delta-only resolution test |
| Review registries and dashboards | Derived outputs | Regenerated for the relaunch-loop review | Registry P2 count |

Required inventories:
- Same-class producers: `rg -n "record\.id\b" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` for other places that key on `id` only.
- Consumers: `rg -n "summary-only" .skilled/skills/system-deep-loop`.
- Matrix axes: id key (`id`, `findingId`, both) by summary shape (per run, cumulative, absent).
- Invariant: every registry finding traces to a reported finding or to a summary count no listed finding covers.
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
| Unit | Reducer intake and fallback | `node --test` |
| Integration | Reducer over the relaunch-loop review folder | `reduce-state.cjs` |
| Manual | None | n/a |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin `swe-2-max` | External | Green | Build and review wait |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a deep-loop script test regresses.
- **Procedure**: re-dispatch a narrower fix against `reduce-state.cjs`; the regenerated registry is rebuilt by rerunning the reducer.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Tests | None | Fix |
| Fix | Tests | Regenerate |
| Regenerate | Fix | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done |
| Core Implementation | Low | One build lane and a review |
| Verification | Low | Test suite and one reducer rerun |
| **Total** | | **Under an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: the regenerated files are derived and rebuild from the log
- [ ] Feature flag configured: not applicable
- [ ] Monitoring alerts set: not applicable

### Rollback Procedure
1. Re-dispatch a fix for any failing test.
2. Rerun the reducer to rebuild derived files.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
