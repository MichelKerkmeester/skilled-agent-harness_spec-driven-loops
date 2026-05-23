---
title: "Task Breakdown: Layer D Launcher Pre-Flight Reap and Parity Fixtures"
description: "Completed task ledger for JS/Python launcher Layer D pre-flight reap and shared fixture parity tests."
trigger_phrases:
  - "arc 010 005 003 tasks"
  - "layer d launcher reap tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/005-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-layer-d-launcher-tasks"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0100050030100050030100050030100050030100050030100050030100050030"
      session_id: "010-005-003-layer-d-launcher-reap"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Layer D Launcher Pre-Flight Reap and Parity Fixtures

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` Complete
- `[ ]` Not started
- `P0` Required for correctness
- `P1` Required for maintainability
- `P2` Nice-to-have
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 P0 Scaffold Level 2 packet docs at the approved path.
- [x] T002 P0 Run strict validation on the scaffold before implementation.
- [x] T003 P0 Read 010/004/001 ADR-001/ADR-005 and 010/005/001 ledger v2 contracts.
- [x] T004 P0 Read both launcher twins, current Vitest file, shared fixture JSON, and 010/005/002 env naming.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 P0 Add JS identity-verified owner liveness reasons matching Python.
- [x] T011 P0 Add JS pre-flight reap before reuse/spawn.
- [x] T012 P0 Register JS current owner on reused and spawned rows.
- [x] T013 P0 Add Python pre-flight reap mirror before reuse/spawn.
- [x] T014 P0 Register Python current owner on spawned rows and reused rows.
- [x] T015 P0 Preserve JS `detached: true` plus `child.unref()` and Python `start_new_session=True`.
- [x] T016 P1 Emit best-effort launcher reaper telemetry using `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 P0 Extend Vitest to consume `reaper-ledger-cases.json`.
- [x] T021 P0 Cover legacy v1 migration, health-unreachable dead-owner reap, and live-owner no-kill.
- [x] T022 P0 Run Python ledger pytest suite.
- [x] T023 P0 Run JS Vitest suite.
- [x] T024 P1 Run syntax and OpenCode alignment checks.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T030 P0 Fill checklist with evidence.
- [x] T031 P0 Fill implementation summary with parity matrix.
- [x] T032 P0 Run strict packet validation.
- [x] T033 P1 Leave commit handoff text without committing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor ADRs: `../004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/decision-record.md`
- Ledger v2 phase: `../001-implement-ledger-v2-schema-and-identity-verified-pid/`
- Layer B sibling: `../002-implement-layer-b-sidecar-self-check-and-in-flight-gate/`
- Shared fixture: `.opencode/skills/system-rerank-sidecar/tests/fixtures/reaper-ledger-cases.json`
<!-- /ANCHOR:cross-refs -->
