---
title: "Implementation Plan: deep-review reducer-cluster backlog remediation"
description: "Implement 5 surgical behavioral changes to reduce-state.cjs with vitest, document 4 by-design gaps."
trigger_phrases:
  - "reducer cluster remediation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/002-phase5-backlog/002-reducer-cluster-remediation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "plan-authored"
    next_safe_action: "implement-LG-0001"
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000007023"
      session_id: "131-000-007-002-reducer"
      parent_session_id: "131-000-007-002-reducer"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: deep-review reducer-cluster backlog remediation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS (`reduce-state.cjs`), TypeScript vitest |
| **Framework** | vitest, system-spec-kit validator |
| **Storage** | `.opencode/skills/deep-review/scripts/` |
| **Testing** | new `reducer-backlog-remediation.vitest.ts` + existing reducer suite (regression) |

### Overview

Five surgical, additive behavioral changes to the loop-critical `reduce-state.cjs`, each aligning the reducer to a documented contract, each covered by vitest. Four further gaps are documented as by-design in the decision record. No convergence-math change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 5 open gaps verified against current reducer code
- [x] 4 by-design gaps classified with rationale
- [x] Contract sources located (SKILL.md 8.1, state_format findingDetails + traceabilityChecks + validation rules)

### Definition of Done
- [ ] 5 changes implemented + green vitest
- [ ] Existing reducer suite green (no regression)
- [ ] Strict validate exit 0
- [ ] resource-map reducer-gap terminal states recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Change map (reduce-state.cjs)

| Gap | Function touched | Change |
|-----|------------------|--------|
| LG-0001 | `deriveDashboardStatus` (+ a latest-lifecycle-event helper) | Detect latest `userPaused`/`stuckRecovery` event and surface PAUSED/RECOVERING when newer than the last iteration/resume |
| LG-0005 | `deltaRecordToFinding` | Carry `scopeProof` (string) + `affectedSurfaceHints` (string[]) onto the finding object so they reach registry findingDetails |
| LG-0006 | new `buildTraceabilityRollup` + `buildRegistry` | Aggregate latest `traceabilityChecks.summary` + `results[]` into a registry `traceability` field |
| LG-0008 | `buildFindingRegistry` post-pass | After ID-keyed build, collapse entries sharing a content_hash (primary) or file:line+normalized-title (fallback) into one with a merged `dimensions[]` list |
| LG-0033 | new `validateReviewRecordFields` called from the reduce flow | Emit additive field-level warnings per state_format validation rules without throwing |

### Invariants preserved
- Idempotent reduce (same input produces same output).
- Backward compatibility: absent optional fields fall back to legacy behavior.
- No change to `computeConvergenceScore` (LG-0003 by-design).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify each gap against current reducer code
- [x] Author spec.md / plan.md / tasks.md / checklist.md / decision-record.md

### Phase 2: Implementation (one change + test at a time)
- [ ] LG-0001 dashboard surfacing + test
- [ ] LG-0005 field carry-through + test
- [ ] LG-0006 traceability rollup + test
- [ ] LG-0008 two-tier dedup + test
- [ ] LG-0033 field validation + test

### Phase 3: Verification
- [ ] New vitest green
- [ ] Existing reducer suite green (regression)
- [ ] Strict validate exit 0
- [ ] resource-map terminal-state update + implementation-summary filled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `parseJsonlDetailed` + field validation | vitest, direct import |
| Integration | `reduceReviewState` end-to-end on temp fixtures | vitest, tmp review dir |
| Regression | existing reducer suite | `vitest run` on the 3 reducer test files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| vitest harness | Internal | Green | Test gate blocked |
| Existing reducer tests | Internal | Green | Regression baseline |
| `validate.sh` | Internal | Green | Phase exit blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A reducer change regresses convergence or the existing suite.
- **Procedure**: `git revert` the implementation commit. The reducer reverts to ID-only dedup and prior dashboard status. New optional fields become inert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implement + test each) ──► Phase 3 (Regression + validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implement |
| Implement | Setup | Verify |
| Verify | Implement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | done |
| Implement | High | 3-4 hours (5 changes + tests on loop-critical code) |
| Verify | Med | 1 hour (regression + validate) |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All commits on `main`
- [ ] Existing reducer suite green before commit
- [ ] Scope-strict staging (reducer + test + this packet + 003 resource-map)

### Rollback Procedure
1. `git revert <commit-sha>`.
2. Re-run the reducer suite to confirm baseline restored.

### Data Reversal
- **Has data migrations?** No. Registry/dashboard are regenerated from JSONL on next reduce.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:adr-summary -->
## L3: ADR SUMMARY

| ADR | Decision |
|-----|----------|
| ADR-001 | Reopen ADR-002 to implement the 5 genuinely-open reducer behaviors with tests |
| ADR-002 | Document LG-0002/0003/0004/0023 as by-design (no code change) |

See `decision-record.md` for full context, alternatives, and five-checks evaluation.
<!-- /ANCHOR:adr-summary -->
