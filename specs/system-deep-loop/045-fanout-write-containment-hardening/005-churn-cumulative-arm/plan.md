---
title: "Implementation Plan: Give the shared-checkout churn detector a cumulative arm so slow drift trips it"
description: "One running total inside the existing churn sampler, one fan-out config field, and two ledger fields. The burst arm, the latch and the sampling cadence are untouched."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening/005-churn-cumulative-arm"
    last_updated_at: "2026-09-14T13:30:00Z"
    last_updated_by: "deepseek-v4.1-flash-max"
    recent_action: "Added the cumulative churn arm and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-005-churn-cumulative-arm"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Give the shared-checkout churn detector a cumulative arm so slow drift trips it

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS runner script plus a TypeScript (ESM) config library |
| **Framework** | None |
| **Storage** | Git working tree, JSONL orchestration status ledger |
| **Testing** | Vitest, with a stub `opencode` binary for the integration case |

### Overview
`startSharedCheckoutChurnDetector` already computed `newlyDirty` per sample; it now also accumulates it. Either count crossing its own threshold detects, the callback reports both, and the runner writes them. The threshold arrives through `containment.churnCumulativeThreshold` on the fan-out config, the same route `churnThreshold` takes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Accumulator beside an existing windowed counter, both fed by one sample

### Key Components
- **`startSharedCheckoutChurnDetector`**: samples the containment snapshot, computes newly dirty paths, accumulates them, and detects on either arm
- **`containment.churnCumulativeThreshold`**: the config field that arms the accumulator, default 12, zero disabling that arm
- **`shared_checkout_detected` ledger event**: carries both counts and both thresholds

### Data Flow
The progress heartbeat calls the sampler. The sampler asks the containment snapshot for dirty out-of-lineage paths, diffs them against the previous sample, adds the difference to the running total, and either arm may detect. On detection the callback latches `containmentMode` to preserve and appends one ledger event; sampling stops.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `startSharedCheckoutChurnDetector` | Windowed count only, threshold 0 disabled the whole detector | update | `fanout-run.vitest.ts:3114`, `:3132`, `:3145` |
| `containment` schema and type | Owned `mode`, `churnThreshold`, `worktrees` | update | `executor-config.vitest.ts:470`; typecheck exit 0 |
| Runner call site and ledger append | Wrote `newly_dirty_paths` and `churn_threshold` | update | `fanout-run.cjs:3056`, `:3722` |
| Snapshot, exclusions, latch, cadence | Sampling input and remedy | unchanged | Existing churn cases stay green |

Required inventories:
- Same-class producers: `rg -n 'churnThreshold|churnCumulativeThreshold' .opencode/skills/system-deep-loop/runtime` - the schema, the prefault, the interface, the runner resolution and the detector call site.
- Consumers of the changed symbol: the single detector call site; no other caller reads the ledger fields.
- Matrix axes: arm (per-window, cumulative) x window shape (burst in one window, one path per window, quiet) x config (default, explicit value, zero).
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
| Unit | Config default, zero, explicit value, negative and non-integer rejection | Vitest against `executor-config.ts` |
| Integration | Stub lane spreading one write per heartbeat until the cumulative threshold trips; burst and below-threshold cases as controls | Vitest against `fanout-run.cjs` with a stub `opencode` on PATH |
| Manual | None; the observed event was read from a standalone run of the same fixture | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The containment snapshot and its exclusions | Internal | Green | Unchanged; the arm reads whatever that snapshot returns |
| Git status porcelain output | External | Green | Already the input the detector counts from |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The cumulative arm forces preserve on ordinary working-tree drift
- **Procedure**: Set `containment.churnCumulativeThreshold: 0` to disarm it per run, or revert this phase's commit to remove the arm
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | minutes |
| Core Implementation | Low | one dispatch |
| Verification | Med | two test files plus typecheck |
| **Total** | | **one dispatch plus one verification pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (not applicable: no data changes)
- [x] Feature flag configured (`containment.churnCumulativeThreshold`, zero disarms)
- [x] Monitoring alerts set (the ledger event is the alert)

### Rollback Procedure
1. Disarm per run with `containment.churnCumulativeThreshold: 0`; no redeploy needed
2. Revert this phase's commit if the arm itself is wrong
3. Re-run the two touched test files and the typecheck to confirm the revert
4. Notify the packet's next phase only if the config field is removed rather than disarmed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

