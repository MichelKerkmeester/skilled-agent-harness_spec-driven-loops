---
title: "Plan: Adapter Resident-Memory Benchmark"
description: "Implementation plan for Adapter Resident-Memory Benchmark."
trigger_phrases:
  - "adapter-resident-memory-benchmark"
  - "010 follow-on 2"
  - "adapter rss benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/002-adapter-resident-memory-benchmark"
    last_updated_at: "2026-05-22T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded follow-on phase."
    next_safe_action: "Plan and execute this phase when ready."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a02020202020202020202020202020202020202020202020202020202020202"
      session_id: "010-memory-leak-follow-ons-arc-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Source benchmark-gating decision documented in arc 009 phase 008 implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Adapter Resident-Memory Benchmark

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js benchmark scripts |
| **Framework** | CocoIndex adapter and sidecar fallback paths |
| **Storage** | Benchmark output captured in phase documentation |
| **Testing** | Benchmark invocation and strict spec validation |

### Overview
This phase is scaffolded for follow-on planning. It will measure adapter resident-memory growth on successful-search and sidecar 5xx fallback paths, then record whether the P2 severity holds or should escalate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Read the phase spec and arc 009 phase 008 implementation summary.
- [ ] Confirm benchmark entry points and operator-machine requirements.
- [ ] Define the run count, RSS threshold, and output format.

### Definition of Done
- [ ] Benchmark methodology is reproducible.
- [ ] RSS slope numbers are recorded for both required paths.
- [ ] Severity decision is documented with evidence.
- [ ] This phase and parent arc strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Scaffold Contract
The implementation plan is intentionally generic at scaffold time. The executing agent should replace this section with the concrete benchmark design after reading the adapter lifecycle code, sidecar fallback hooks, and existing process-memory harness.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/` | Benchmark workspace | Add benchmark scripts if the phase proceeds | Operator-machine benchmark run |
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | Process memory helper | Modify only if reusable slope helpers are needed | Targeted script validation |
| `implementation-summary.md` | Phase evidence ledger | Record methodology, numbers, and severity decision | Strict spec validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the child spec and source phase 008 evidence.
- [ ] Identify benchmark entry points for successful-search and fallback paths.
- [ ] Replace scaffold placeholders with a concrete benchmark plan.

### Phase 2: Implementation
- [ ] Add or reuse a benchmark runner for successful-search RSS slope.
- [ ] Add or reuse a benchmark runner for sidecar 5xx fallback RSS delta.
- [ ] Capture before, after, delta, and slope statistics.

### Phase 3: Verification
- [ ] Run benchmark commands in the supported operator environment.
- [ ] Update `implementation-summary.md` with results and decision.
- [ ] Strict-validate this phase and the parent arc.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | Successful-search RSS slope | Phase benchmark runner |
| Benchmark | Sidecar 5xx fallback RSS delta | Phase benchmark runner |
| Analysis | Severity decision against threshold | Recorded benchmark output |
| Documentation | Phase and parent validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Arc 009 phase 008 implementation summary | Source evidence | Available | Required to recover the P2-default benchmark gate. |
| Process-memory harness | Measurement helper | Available from predecessor work | Required or useful for RSS snapshots and slope calculation. |
| Local sidecar environment | Runtime dependency | Pending phase execution | Required for representative fallback measurement. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Benchmark scripts are noisy, non-reproducible, or change runtime behavior outside measurement scope.
- **Procedure**: Revert only benchmark and helper changes, preserve observed output in `implementation-summary.md`, and replan the measurement path.
<!-- /ANCHOR:rollback -->
