---
title: "Plan: Investigation P1 Fixes for Resource Bounds and Input Validation"
description: "Plan for selected P1 resource-bound and input-validation findings F48, F85, F86, and F87."
trigger_phrases:
  - "arc 010 resource bounds plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/002-fix-investigation-p1s-for-resource-bounds-and-input-validation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "planned-resource-bounds-p1-child"
    next_safe_action: "implement-resource-bound-P1s"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020020100020020100020020100020020100020020100020020100020020"
      session_id: "010-002-002-resource-bounds"
      parent_session_id: null
    completion_pct: 0
---
# Plan: Investigation P1 Fixes for Resource Bounds and Input Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, Python parity surface |
| **Findings** | F48, F85, F86, F87 |
| **Evidence** | Arc 010/001 `research.md` and `findings-registry.json` |

This phase applies explicit caps and unpredictability to selected P1 resource-bound contracts after the P0 IPC parser fixes are planned.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Registry keyword selection captured all P1 fingerprints containing `unbounded`, `resource-exhaustion`, `input-validation`, or `predictable`.
- [x] Four selected findings are listed in `checklist.md`.

### Definition of Done
- [ ] All four checklist rows are closed with tests.
- [ ] Cap values are documented in code or tests.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced
- Request IDs are unpredictable across the client IPC boundary.
- HTTP health response accumulation has an explicit maximum body size.
- Client and worker embed batch sizes are bounded and aligned.

### Affected Surfaces

| Surface | Findings | Invariant |
|---------|----------|-----------|
| `sidecar-client.ts` request/send path | F48, F86 | Randomized IDs and max embed batch size. |
| `ensure-rerank-sidecar.cjs` health check | F85 | Max health body size. |
| `ensure_rerank_sidecar.py` health check | F85 | Parity with JS if cap contract changes. |
| `sidecar-worker.ts` parser/embed path | F87 | Max worker input array length. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Request Identity
Implement F48 using random or random-prefixed request IDs.

### Phase 2: HTTP Body Cap
Implement F85 by bounding `healthPayload` accumulation and aligning parity expectations.

### Phase 3: Input Batch Cap
Implement F86 and F87 with matching max input length behavior.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Finding | Required Test |
|---------|---------------|
| F48 | Request IDs are not simple sequential integers under normal generation. |
| F85 | Health body accumulation stops and fails closed above cap. |
| F86 | Client rejects more than the max embed batch before copying/dispatch. |
| F87 | Worker rejects more than the max input length before embedding. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| P0 cap constants | Internal | Planned | P1 limits should not conflict with parser limits. |
| Existing tests | Internal | Expected | Need deterministic hooks for random ID testing. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If caps reject legitimate workloads, tune constants with evidence and keep the validation structure. Do not remove the boundary checks once added.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Resource-bound P1s | Child 001 parser caps | Later simplification of sidecar API surface |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Implementation | 1 dispatch | Four selected P1 fixes. |
| Verification | 1 pass | Cap and ID tests plus strict validation. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Failed validation leaves this phase active; record the failing command and cap value in `implementation-summary.md` before retrying.
<!-- /ANCHOR:enhanced-rollback -->
