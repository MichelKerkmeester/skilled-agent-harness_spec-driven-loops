---
title: "Verification Checklist: Launcher Lease Integration Test De-Flake"
description: "QA verification that the un-skipped lease integration suite runs and passes reliably, exercises packet 020's socketPath end-to-end, and leaks no processes."
trigger_phrases:
  - "launcher lease test checklist"
  - "deflake launcher checklist"
  - "spawned launcher socketPath checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/024-launcher-lease-integration-test"
    last_updated_at: "2026-06-04T13:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All checklist items verified with command evidence"
    next_safe_action: "None. Verification complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item carries command evidence. Run from `.opencode/skills/system-spec-kit/mcp_server`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Skipped suite read and root cause confirmed by reproduction. Evidence: spawned-launcher stderr `Error: Cannot find module './lib/model-server-supervision.cjs'`.
- [x] CHK-002 [P1] Packet 020 socketPath lease semantics understood (lease records `socketPath`; bridge prefers stored path on disk).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No production `.cjs` modified; change is test-only. Evidence: `git diff --stat` shows only `tests/launcher-lease.vitest.ts`.
- [x] CHK-011 [P0] Comment hygiene: no spec-folder paths, packet/phase numbers, or ADR/REQ ids in code comments. Durable WHY only.
- [x] CHK-012 [P1] No fixed/colliding temp paths; each workspace uses `mkdtempSync`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Suite runs un-skipped and passes. Evidence: `npx vitest run tests/launcher-lease.vitest.ts` -> `Tests 9 passed (9)`, 0 skipped.
- [x] CHK-021 [P0] Non-flaky across 3 runs. Evidence: 3 consecutive runs each `9 passed`, durations ~0.9-1.1s.
- [x] CHK-022 [P0] New socketPath bridge test asserts `lease.socketPath` equals the owner socket and the secondary logs `bridging to lease holder pid=<owner> socket=<owner socket>`.
- [x] CHK-023 [P0] Regression suites pass. Evidence: `npx vitest run tests/launcher-ipc-bridge-probe.vitest.ts tests/launcher-recycle-lease.vitest.ts` -> `Tests 16 passed (16)`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Fixture copies the launcher `lib/` tree so the launcher boots and writes a lease.
- [x] CHK-FIX-002 [P0] Readiness is polled (lease pid, socket existence, listening log) before any assertion.
- [x] CHK-FIX-003 [P0] Every spawned launcher reaped in `afterEach` (SIGTERM then SIGKILL) before temp dirs are removed.
- [x] CHK-FIX-004 [P1] No sub-test left gated; full un-skip achieved (all 8 originals + 1 new = 9).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Per-test `SPECKIT_IPC_SOCKET_DIR` inside the temp root; no spawned launcher resolves the live `/tmp/mk-spec-memory` daemon socket.
- [x] CHK-031 [P0] No temp-dir orphan processes after the run. Evidence: post-run `ps` audit shows NO TEMP-DIR ORPHANS; only pre-existing live daemons (cwd = repo root, unchanged PIDs) survive.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md authored at Level 2 from templates.
- [x] CHK-041 [P1] `validate.sh --strict` run against this packet (exit recorded in implementation-summary).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test lives under `mcp_server/tests/`; no new files outside tests scope.
- [x] CHK-051 [P1] No stray fixtures left on disk (temp dirs removed in `afterEach`).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Check | Result |
|-------|--------|
| Suite un-skipped + passing | PASS (9 passed, 0 skipped) |
| Non-flaky x3 | PASS (9 passed each run) |
| socketPath bridge end-to-end | PASS (stored path preferred over divergent recompute) |
| Regressions | PASS (16 passed) |
| No temp-dir orphans | PASS |
<!-- /ANCHOR:summary -->
