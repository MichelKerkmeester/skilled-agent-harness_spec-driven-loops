---
title: "Tasks: Layer B Sidecar Self-Check and In-Flight Gate"
description: "Canonical-anchor task ledger for rerank_sidecar Layer B owner self-check, Layer A idle timeout, telemetry, and tests."
trigger_phrases:
  - "arc 010 005 002 tasks"
  - "rerank sidecar self reaper tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/002-implement-layer-b-sidecar-self-check-and-in-flight-gate"
    last_updated_at: "2026-05-23T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-rerank-sidecar-reaper-tasks"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100050020100050020100050020100050020100050020100050020100050020"
      session_id: "010-005-002-rerank-sidecar-self-reaper"
      parent_session_id: null
    completion_pct: 100
---
# Tasks: Layer B Sidecar Self-Check and In-Flight Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T000 Read `system-spec-kit` and `sk-code` workflows for spec and OpenCode/Python verification.
- [x] T001 Read 010/004/001 ADR-001, ADR-006, ADR-007 and Files-to-Change handoff.
- [x] T002 Read 010/005/001 ledger v2 sibling docs and current `sidecar_ledger.py`.
- [x] T003 Read current `rerank_sidecar.py` and `test_rerank_sidecar.py` before editing.
- [x] T004 Scaffold this Level 2 packet from canonical sibling anchors and strict-validate scaffold.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add reaper env knobs: heartbeat, idle timeout, telemetry path, and manual disable.
- [x] T011 Add `InFlightGate`, pending shutdown state, and request drain handling.
- [x] T012 Add locked ledger read and owner-state evaluation for rows matching the sidecar port.
- [x] T013 Add telemetry JSONL writer with temp-file replace and async executor wrapper for reaper use.
- [x] T014 Add `evaluate_reaper_once()` and `reaper_loop()` for Layer B owner-death and Layer A idle decisions.
- [x] T015 Update FastAPI `lifespan()` to create/cancel the reaper task and preserve model cleanup.
- [x] T016 Gate `/warmup` and `/rerank` with in-flight enter/exit and idle refresh in `finally`.
- [x] T017 Leave `/health` as a pure probe with no idle refresh.
- [x] T018 Rewrite/extend tests with fake `sentence_transformers.CrossEncoder`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run requested `python3 -m pytest tests/test_rerank_sidecar.py -v`; document dependency failure from system Python.
- [x] T021 Run `.venv/bin/python -m pytest tests/test_rerank_sidecar.py -v`; 15 tests pass.
- [x] T022 Run `.venv/bin/python -m pytest tests/test_sidecar_ledger.py -v`; 22 tests pass.
- [x] T023 Run `.venv/bin/python -m py_compile scripts/rerank_sidecar.py tests/test_rerank_sidecar.py`.
- [x] T024 Run `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar`.
- [x] T025 Fill `checklist.md`, `decision-record.md`, and `implementation-summary.md` with evidence.
- [x] T026 Run strict validation for this packet folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Layer B owner-death self-check implemented with in-flight gating.
- [x] Layer A idle timeout implemented and `/health` proven not to refresh idle.
- [x] Telemetry JSONL writes structured reaper evidence.
- [x] Manual debug opt-out prevents reaper startup.
- [x] `implementation-summary.md` contains `## Commit Handoff` with absolute changed-file paths.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Predecessor ADRs**: `../../004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/decision-record.md`
- **Ledger sibling**: `../001-implement-ledger-v2-schema-and-identity-verified-pid/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:architecture-tasks -->
## Architecture Tasks

- [x] ARCH-001 Preserve detached warm-model reuse; do not change launchers.
- [x] ARCH-002 Use FastAPI lifespan task, not daemon threads.
- [x] ARCH-003 Keep changes scoped to approved source, test, and packet docs.
- [x] ARCH-004 Record ADR refinements for telemetry env naming and legacy empty-owner policy.
<!-- /ANCHOR:architecture-tasks -->
