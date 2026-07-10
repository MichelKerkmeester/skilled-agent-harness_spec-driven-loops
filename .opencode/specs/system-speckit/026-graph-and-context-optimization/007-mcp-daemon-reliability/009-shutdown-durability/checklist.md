---
title: "Verification Checklist: shutdown durability"
description: "Verification checklist for forwarded-signal shutdown durability and launcher grace hardening."
trigger_phrases:
  - "shutdown durability checklist"
  - "forwarded signal shutdown verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented shutdown durability guards"
    next_safe_action: "Run staged verification"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Shutdown Durability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md.
- [x] CHK-002 [P0] Required files read before editing.
- [x] CHK-003 [P1] Sibling packet 008 WAL checkpoint context reviewed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `SHUTDOWN_DEADLINE_MS` remains 5000.
- [x] CHK-011 [P0] No SIGKILL, `exit`, or `beforeExit` handler added.
- [x] CHK-012 [P0] `uncaughtException` and `unhandledRejection` exit codes remain 1.
- [x] CHK-013 [P1] Transport, IPC bridge, shutdown hooks, and registered timers keep their relative order after vectorIndex close.
- [x] CHK-014 [P1] No SQLite pragma, probe timeout, DB, or recovery logic touched.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `node --check ../../../../bin/mk-spec-memory-launcher.cjs` passes from `mcp_server`. (PASS 2026-05-29 — node --check OK.)
- [x] CHK-021 [P0] `npm run build --workspace=@spec-kit/mcp-server` passes. (PASS 2026-05-29 — workspace build exit 0.)
- [ ] CHK-022 [P0] Targeted vitest suites pass. (Not re-run this session.)
- [ ] CHK-023 [P1] `context-server.vitest.ts` fatalShutdown/vectorIndex regex still passes. (Not re-run this session.)
- [x] CHK-024 [P1] Strict spec validation exits 0. (PASS 2026-05-29 — validate.sh --strict exit 0.)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: lifecycle durability fix.
- [x] CHK-FIX-002 [P0] Producer inventory: `fatalShutdown` cleanup order controls `vectorIndex.closeDb()`.
- [x] CHK-FIX-003 [P0] Consumer inventory: launcher forwards SIGINT, SIGTERM, SIGHUP, and SIGQUIT.
- [x] CHK-FIX-004 [P0] Adversarial: external SIGKILL grace now exceeds daemon deadline.
- [x] CHK-FIX-005 [P1] Regression test covers new signal handlers and source order.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced.
- [x] CHK-031 [P0] No new network or external command surface.
- [x] CHK-032 [P1] No data files modified or recovered.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/implementation-summary authored.
- [x] CHK-041 [P1] Status set to implemented.
- [x] CHK-042 [P2] Out-of-scope bans documented.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet created under `007-mcp-daemon-reliability/009-shutdown-durability`.
- [x] CHK-051 [P1] No `030-*` folder created or used.
- [x] CHK-052 [P1] No `description.json` or `graph-metadata.json` generated.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 11/14 |
| P1 Items | 10 | 9/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-29 (node --check + build + strict-validate PASS; targeted vitest CHK-022/023 not re-run this session)
<!-- /ANCHOR:summary -->
