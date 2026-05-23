---
title: "Plan: Investigation P1 Fixes for Sidecar Process Ownership Lifecycle"
description: "Plan for selected lifecycle findings F79 and F88."
trigger_phrases:
  - "arc 010 lifecycle plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "planned-lifecycle-p1-child"
    next_safe_action: "implement-lifecycle-P1s"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020030100020030100020030100020030100020030100020030100020030"
      session_id: "010-002-003-lifecycle"
      parent_session_id: null
    completion_pct: 0
---
# Plan: Investigation P1 Fixes for Sidecar Process Ownership Lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS |
| **Findings** | F79, F88 |
| **Evidence** | Arc 010/001 `research.md` and `findings-registry.json` |

This phase makes selected lifecycle behavior explicit before broader parity work aligns the TS/CJS/Python sidecar twins.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Explicit F88 and keyword-selected F79 are assigned.
- [x] Scope is limited to lifecycle and process-ownership behavior.

### Definition of Done
- [ ] F79 and F88 checklist rows are closed with tests.
- [ ] Implementation summary records the ownership/liveness contract.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced
- Termination uses one coherent in-flight state.
- Unknown liveness is explicit and cannot silently masquerade as healthy ownership.
- Tests cover both normal and ambiguous lifecycle states.

### Affected Surfaces

| Surface | Findings | Invariant |
|---------|----------|-----------|
| `sidecar-client.ts` termination | F79 | Idempotent termination without timing hack reliance. |
| `ensure-rerank-sidecar.cjs` liveness | F88 | Explicit liveness state for unknown process errors. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Termination State
Implement F79 by simplifying dual-promise termination state only after tests describe current behavior.

### Phase 2: Process Liveness
Implement F88 by choosing documented default-alive behavior with warnings or an explicit unknown state that refuses reuse.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Finding | Required Test |
|---------|---------------|
| F79 | Concurrent termination callers settle through one termination path. |
| F88 | ESRCH, EPERM, unknown error, and alive cases are classified explicitly. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing lifecycle tests | Internal | Expected | May need new focused fixtures. |
| Child 004 parity phase | Adjacent | Planned | F88 semantics may need cross-runtime parity follow-up. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If lifecycle behavior changes break startup or shutdown tests, keep the new tests and tune the implementation path rather than reverting to ambiguous state handling.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Lifecycle P1s | Child 001/002 resource bounds only if shared tests overlap | Child 004 parity decisions around liveness |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Implementation | 1 dispatch | Two selected lifecycle fixes. |
| Verification | 1 pass | Termination and liveness tests. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Record any startup/liveness regression in `implementation-summary.md` with the exact liveness case that failed.
<!-- /ANCHOR:enhanced-rollback -->
