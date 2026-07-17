---
title: "Tasks: Ledger v2 Schema and Identity-Verified PID Helpers"
description: "Canonical task ledger for arc 010/005/001 ledger v2 and identity-verified PID implementation."
trigger_phrases:
  - "arc 010 005 001 tasks"
  - "ledger v2 identity pid tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/001-implement-ledger-v2-schema-and-identity-verified-pid"
    last_updated_at: "2026-05-23T11:30:00Z"
    last_updated_by: "codex"
    recent_action: "completed-ledger-v2-tasks"
    next_safe_action: "Parent agent commit handoff"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100050010100050010100050010100050010100050010100050010100050010"
      session_id: "010-005-001-ledger-v2-identity-pid"
      parent_session_id: null
    completion_pct: 100
---

# Tasks: Ledger v2 Schema and Identity-Verified PID Helpers

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

- [x] T000 Read root `AGENTS.md`, `system-spec-kit`, and `sk-code` guidance.
- [x] T001 Read arc 010/004/001 decision record, Files-to-Change handoff, and research sections 7, 8, and 10.
- [x] T002 Read current `sidecar_ledger.py` and existing `test_sidecar_ledger.py`.
- [x] T003 Read F69/F102 precedent from arc 010/002/004 and canonical anchors from arc 010/003/001.
- [x] T004 Attempt `ps -p $$ -o lstart=,comm=` and record sandbox behavior.
- [x] T005 Run strict validation on scaffold before source edits.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Extend `SidecarLedgerRow` with v2 owners and reaper fields while preserving old constructor fields.
- [x] T011 Add owner identity parsing/capture helpers for `ps -p PID -o lstart= -o comm=`.
- [x] T012 Implement `process_liveness(pid, recorded_create_timestamp, recorded_comm)` with all ADR-002 reasons.
- [x] T013 Update ledger read/write paths for v2 writes and v1 compatibility.
- [x] T014 Add lock-backed owner pruning and owner registration helpers.
- [x] T015 Add shared `tests/fixtures/reaper-ledger-cases.json` matrix.
- [x] T016 Rewrite/update `tests/test_sidecar_ledger.py` with the requested pytest class structure.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run `cd .opencode/skills/system-rerank-sidecar && python3 -m pytest tests/test_sidecar_ledger.py -v`.
- [x] T021 Run strict validation for this packet folder.
- [x] T022 Fill `checklist.md` with file:line evidence per in-scope row.
- [x] T023 Fill `implementation-summary.md` with completed status, 100 percent completion, verification evidence, and commit handoff.
- [x] T024 Re-run targeted pytest and strict validation after documentation updates.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Ledger writes v2 and reads v1.
- [x] Identity-verified liveness reasons are covered.
- [x] Owner prune/register helpers are covered.
- [x] Shared fixture matrix is consumed by Python tests.
- [x] Targeted pytest and strict validation exit 0.
- [x] `implementation-summary.md` contains `## Commit Handoff` with absolute paths.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Binding ADRs**: `../../004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/decision-record.md`
- **Binding research**: `../../004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/research/research.md`
- **F69/F102 precedent**: `../../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity/decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:architecture-tasks -->
## Architecture Tasks

- [x] ARCH-001 Preserve `ownerToken` as reuse identity; do not replace it with process owners.
- [x] ARCH-002 Keep `detached`/launcher semantics out of this phase.
- [x] ARCH-003 Keep fixture matrix stable for later JS consumption.
<!-- /ANCHOR:architecture-tasks -->
