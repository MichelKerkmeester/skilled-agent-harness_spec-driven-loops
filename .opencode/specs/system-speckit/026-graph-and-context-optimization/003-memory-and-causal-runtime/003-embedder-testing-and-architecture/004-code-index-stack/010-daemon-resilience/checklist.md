---
title: "Verification Checklist: CocoIndex daemon resilience"
description: "Level 2 verification checklist with P0 hard blockers and P1 required items. Verification Date: TBD (post-implementation)"
trigger_phrases:
  - "cocoindex daemon checklist"
  - "verification gate"
  - "BrokenPipeError checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience"
    last_updated_at: "2026-05-07T07:36:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist"
    next_safe_action: "Author description.json + validate strict"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-07-027-cocoindex-daemon-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: CocoIndex daemon resilience

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements REQ-001..REQ-006 documented in `spec.md`
- [ ] CHK-002 [P0] Two-patch architecture defined in `plan.md` (idempotency guard + pipe-safe error handler)
- [ ] CHK-003 [P1] Live evidence captured: process snapshot, daemon.log line count, BrokenPipeError count
- [ ] CHK-004 [P1] Existing helper functions confirmed in `client.py` (`_pid_alive`, `_cleanup_stale_files`, `daemon_pid_path`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:investigation -->
## Investigation (root cause confirmation)

- [ ] CHK-INV-001 [P0] Bug 1 cited at `client.py:192-225` ($start_daemon()$ lacks pre-flight liveness check)
- [ ] CHK-INV-002 [P0] Bug 2 cited at `daemon.py:436-444` (error-response `send_bytes` shares the broken pipe with the original failure)
- [ ] CHK-INV-003 [P1] Stale daemon PID 98364 (Apr 27) confirmed alive but disconnected from `daemon.sock`
- [ ] CHK-INV-004 [P1] daemon.log BrokenPipeError frequency confirmed (564 occurrences over the log's lifetime)
<!-- /ANCHOR:investigation -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Patch 1 uses existing `_pid_alive()` and `_cleanup_stale_files()` (no duplicated logic)
- [ ] CHK-011 [P0] Patch 2 catches both `BrokenPipeError` and `ConnectionResetError` (both are normal disconnect modes)
- [ ] CHK-012 [P0] No new module dependencies introduced
- [ ] CHK-013 [P1] Pre-flight check has a bounded code path (no infinite loop possibility on repeated invocation)
- [ ] CHK-014 [P1] Patch 2 does NOT swallow other exception types (only the two pipe-related ones)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `test_start_daemon_idempotent` passes (first call spawns, second call returns)
- [ ] CHK-021 [P0] `test_start_daemon_cleans_stale_pid` passes (stale PID file cleaned, fresh spawn)
- [ ] CHK-022 [P0] `test_handle_connection_swallows_broken_pipe_in_error_path` passes (one log line, not two stack traces)
- [ ] CHK-023 [P0] `test_e2e_double_start_does_not_spawn` passes (real subprocess, asserts singleton)
- [ ] CHK-024 [P0] Existing tests under `mcp-coco-index/mcp_server/tests/` continue to pass (no regressions)
- [ ] CHK-025 [P1] 100-disconnect soak produces zero new BrokenPipeError lines in `daemon.log`
- [ ] CHK-026 [P1] `pgrep -fc "ccc run-daemon"` returns 1 after `ccc run-daemon` invoked twice consecutively
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class declared: this packet is `class-of-bug` (idempotency on spawn site) + `cross-consumer` (error-response path used elsewhere too)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'subprocess.Popen.*daemon|start_daemon\b' .opencode/skills/mcp-coco-index/`
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: `rg -n 'send_bytes\(' .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/`
- [ ] CHK-FIX-004 [P0] Adversarial table tests: stale PID + corrupt PID + same-PID-self + permission-denied + race-on-double-spawn
- [ ] CHK-FIX-005 [P1] Matrix axes: { existing daemon: alive | dead | corrupt-pid | no-pid-file } x { caller: first | second | concurrent } = 12 row coverage
- [ ] CHK-FIX-006 [P1] Hostile env variant: caller without permission to read `daemon.pid` (graceful skip, log + continue)
- [ ] CHK-FIX-007 [P1] Evidence pinned to fix commit SHA, not a moving branch reference
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Pre-flight check does NOT log the PID file contents at INFO or higher (avoid leaking pid info to logs unnecessarily)
- [ ] CHK-031 [P0] No new file-system writes outside the existing `daemon_dir()` path
- [ ] CHK-032 [P1] Pre-flight does NOT signal/kill any process (only checks alive/dead)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md` synchronized
- [ ] CHK-041 [P1] `implementation-summary.md` filled post-implementation (HVR-compliant voice)
- [ ] CHK-042 [P1] Operator recovery procedure documented in `implementation-summary.md` Known Limitations
- [ ] CHK-043 [P2] mcp-coco-index README updated with daemon-lifecycle note (if maintainer-facing readme exists)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline snapshots and soak script live under `<packet>/scratch/`
- [ ] CHK-051 [P1] `scratch/` cleaned before completion claim (move keepers to `assets/` if any)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [ ]/17 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: TBD (post-implementation)
<!-- /ANCHOR:summary -->
