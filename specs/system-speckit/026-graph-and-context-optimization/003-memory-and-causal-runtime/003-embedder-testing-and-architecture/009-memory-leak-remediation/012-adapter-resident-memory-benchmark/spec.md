---
title: "Spec: Adapter Resident-Memory Benchmark"
description: "Phase 008 of arc 009 kept reranker/adapter resident-memory severity at P2 (default) pending benchmark evidence. This phase measures RSS slope on successful-search + sidecar 5xx fallback paths to confirm P2 hold or escalate to P1."
trigger_phrases:
  - "adapter-resident-memory-benchmark"
  - "009 phase 012"
  - "adapter rss benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark"
    last_updated_at: "2026-05-22T16:03:59Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-phase-012-adapter-rss-benchmark"
    next_safe_action: "arc-009-complete-or-operator-rss-followup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a02020202020202020202020202020202020202020202020202020202020202"
      session_id: "009-memory-leak-remediation-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Source benchmark-gating decision documented in arc 009 phase 008 implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Adapter Resident-Memory Benchmark

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (escalation to P1 contingent on benchmark) |
| **Status** | Completed |
| **Created** | 2026-05-22 |
| **Parent Spec** | ../spec.md |
| **Phase** | 012 of 013 |
| **Predecessor** | (none — independent follow-on) |
| **Successor** | (none — independent follow-on) |
| **Handoff Criteria** | RSS slope numbers recorded; P2 hold or P1 escalation decision documented with evidence. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 012 of the memory-leak remediation arc. Source decision lives in `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle/implementation-summary.md` (the 5xx fallback RSS gate + P2-default decision in the Decisions anchor).

**Scope Boundary**: measure adapter resident-memory growth on two paths — (a) successful-search RSS slope, (b) sidecar 5xx fallback RSS delta. Confirm whether the current P2 severity holds or P1 escalation is warranted.

**Dependencies**:
- Arc 009 phase 002 process-memory-harness (already shipped; provides RSS/swap/wired snapshots).
- Phase 008 adapter close idempotence + fallback RSS gate (already shipped; provides per-fallback RSS measurement hooks).

**Deliverables**:
- Reproducible benchmark harness invocation + N-iteration run script.
- Per-path RSS slope numbers (before / after / delta) + statistical summary.
- Severity decision: P2 hold OR P1 escalation with target follow-on packet.

**Changelog**:
- When this phase closes, refresh the parent arc 009 status and remediation-map item annotation.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Arc 009 phase 008 shipped adapter close idempotence + a fallback RSS gate but kept severity at P2 (default) because growth was not yet measured. Remediation-map item #13 explicitly defers escalation pending benchmark evidence. Without measurement, future regressions cannot be detected and a real leak might hide in P2 noise.

### Purpose
Quantify adapter resident-memory behavior on the two paths phase 008 instrumented, and produce an evidence-based severity decision.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Benchmark script that repeats a representative search workload N times and captures RSS before/after.
- Benchmark script that triggers sidecar 5xx fallback N times and captures RSS before/after.
- RSS slope statistics: mean, median, max, slope-per-iteration, threshold comparison against the 10MB cap from phase 008.
- Severity decision recorded with reproducible methodology.

### Out of Scope
- Fixing the underlying memory leak if one is found (would be a new packet driven by the escalation).
- Benchmarking unrelated paths (only successful-search + sidecar 5xx fallback).
- Cross-machine portability concerns (this benchmark runs on the operator's primary machine — Apple Silicon).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/` | Create | New benchmark folder with the two harness scripts + a runner. |
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | Modify (if needed) | Expose slope-calc helper if useful. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reproducible RSS measurement on both successful-search and sidecar 5xx fallback paths over ≥ 50 iterations. | Live RSS measurement numbers in `implementation-summary.md`, OR operator-runbook deferral with sandbox-blocker evidence when local process enumeration or daemon startup is blocked. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Severity decision (P2 hold, P1 escalation, or operator-deferred-by-design) recorded with explicit threshold + evidence link. | Decision row in `implementation-summary.md` Decisions anchor with live numbers or the operator-runbook deferral evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Successful-search benchmark + sidecar 5xx fallback benchmark scripts exist, run cleanly, and produce slope statistics.
- **SC-002**: Phase updates parent remediation map item #13 with measurement outcome.
- **SC-003**: If escalation is warranted, a follow-on packet is opened and pointed to from this phase's `implementation-summary.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | RSS measurement noise on Apple Silicon | Could obscure small but real slopes. | Use ≥ 50 iterations + median + interquartile range; report slope confidence intervals. |
| Risk | Benchmark depends on live sidecar; sandbox network restrictions | Could prevent benchmark from running in CI. | Document as operator-machine benchmark, not CI gate. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; phase-specific questions must be recorded here before implementation begins.
<!-- /ANCHOR:questions -->
