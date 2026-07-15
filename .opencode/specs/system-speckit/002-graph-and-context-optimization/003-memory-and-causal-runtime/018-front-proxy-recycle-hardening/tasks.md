---
title: "Task Breakdown: Front-Proxy Recycle Hardening"
description: "Ordered task list for the three front-proxy hardening edits, tests, build, commit, and supervised deploy."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/018-front-proxy-recycle-hardening"
    last_updated_at: "2026-06-04T09:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implementation + tests complete"
    next_safe_action: "Commit + supervised deploy"
    blockers: []
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Front-Proxy Recycle Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` done · `[ ]` open. IDs `T#`. Each task maps to one of the three fixes (a)/(b)/(d) or the deploy.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1: Verify the four defect sites against live code (proxy cold-start, launcher report path, daemon lazy-init FATALs).
- [x] T2: Confirm the init-guard rethrow+reset contract makes a thrown init error safe (daemon survives).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T3 (b): `DEFAULT_MAX_COLD_START_ATTEMPTS` 120 → 30 + `resolveColdStartAttempts()` env override; wire default resolution; expose via `__testing`.
- [x] T4 (a): Capture `bridgeOrReportLeaseHeld` decision in launcher main; emit retryable `-32001` JSON-RPC error on `report`.
- [x] T5 (d): Daemon embedder-init catch `throw` instead of `process.exit(1)`.
- [x] T6 (d): Daemon API-key hard-fail `throw` tagged; enclosing transient catch re-throws tagged.
- [x] T7: Add cold-start unit tests (default / env override / invalid fallback).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T8: `node --check` both `.cjs` → OK.
- [x] T9: `npm run build` → exit 0.
- [x] T10: Launcher/proxy/ipc-bridge suite → 54 passed; proxy file 18 passed (incl. 3 new).
- [ ] T11: Commit code + packet (explicit pathspecs, reset-first).
- [ ] T12: Supervised deploy (launcher restart + daemon recycle) + connectivity verify.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All three fixes landed, suites green, build clean; deployed via the supervised path; a new session connects (socket `initialize` < 100ms) and `memory_health` returns normally.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements R1–R5, success criteria.
- `plan.md` — architecture + affected surfaces + rollback.
- Related: `013-memory-index-scan-implementation/003-mcp-front-proxy` (original front-proxy packet).
<!-- /ANCHOR:cross-refs -->
