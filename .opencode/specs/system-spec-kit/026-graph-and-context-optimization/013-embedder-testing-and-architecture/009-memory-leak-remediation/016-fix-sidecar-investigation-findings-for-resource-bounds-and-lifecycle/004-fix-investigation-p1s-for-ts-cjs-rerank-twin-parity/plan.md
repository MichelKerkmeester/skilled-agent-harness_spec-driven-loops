---
title: "Plan: Investigation P1 Fixes for TS CJS Rerank Twin Parity"
description: "Plan for selected drift and parity findings F1, F2, F3, F37, F38, F69, F70, F101, and F102."
trigger_phrases:
  - "arc 010 parity plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "planned-parity-p1-child"
    next_safe_action: "implement-parity-P1s"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020040100020040100020040100020040100020040100020040100020040"
      session_id: "010-002-004-parity"
      parent_session_id: null
    completion_pct: 0
---
# Plan: Investigation P1 Fixes for TS CJS Rerank Twin Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, Python |
| **Findings** | F1, F2, F3, F37, F38, F69, F70, F101, F102 |
| **Evidence** | Arc 010/001 `research.md` and `findings-registry.json` |

This phase aligns sibling runtime contracts and comments where the investigation found P1 drift.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Registry keyword selection captured P1 fingerprints containing `ts-cjs`, `twin`, `drift`, `parity`, `python`, or `cjs`.
- [x] Nine selected findings are listed in `checklist.md`.

### Definition of Done
- [ ] All nine checklist rows are closed or resolved by explicit deletion/documentation.
- [ ] Cross-runtime parity tests or focused single-runtime tests cover each contract.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced
- Rerank ensure helpers agree on config hash, ledger locking, health payload cap, and liveness semantics.
- Backend kind normalization has one canonical source or tested equivalence.
- Documentation comments describe current architecture, not planned architecture.

### Affected Surfaces

| Surface | Findings | Invariant |
|---------|----------|-----------|
| JS/Python ensure helpers | F1, F69, F101, F102 | Equivalent sidecar reuse and file-safety behavior. |
| Sidecar client/router | F2, F3, F37, F38 | Shared or parity-backed backend/env/API contracts. |
| Embedders types comment | F70 | Canonical-location comments match reality. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Rerank Helper Parity
Implement F1, F69, F101, and F102 with parity tests around JS/Python behavior.

### Phase 2: Embedding Contract Parity
Implement F2, F3, F37, F38, and F70 by moving or aligning canonical backend/env contracts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Finding | Required Test |
|---------|---------------|
| F1 | Empty revision handling produces matching config hash behavior. |
| F2/F38/F70 | Backend kind normalization has shared implementation or equivalent outputs. |
| F3 | Recognized env prefixes are documented and tested where applicable. |
| F37 | Production-facing options are narrowed or documented with test-only seams. |
| F69 | Concurrent or lock-focused ledger write test covers JS behavior against Python contract. |
| F101/F102 | Health cap and liveness semantics are parity-tested or documented with identical behavior. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Python test environment | Runtime | Expected | Needed for cross-runtime parity evidence. |
| Node test environment | Runtime | Expected | Needed for CJS/TS parity evidence. |
| Child 002 health cap decision | Adjacent phase | Planned | F101 may share cap decision with F85. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If shared helper extraction proves too broad, retain duplicated implementations only with parity tests and comments pointing at the shared contract.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Rerank helper parity | Child 001/002 if they touch the same ledger or health cap | Future sidecar simplification |
| Embedding contract parity | Existing sidecar-client and execution-router tests | Future API pruning |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Rerank helper parity | 1 dispatch | Cross-runtime tests may dominate. |
| Embedding contract parity | 1 dispatch | Shared helper decision may split if broad. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Record any cross-runtime test environment gap in `implementation-summary.md` and keep the checklist row open until equivalent evidence exists.
<!-- /ANCHOR:enhanced-rollback -->
