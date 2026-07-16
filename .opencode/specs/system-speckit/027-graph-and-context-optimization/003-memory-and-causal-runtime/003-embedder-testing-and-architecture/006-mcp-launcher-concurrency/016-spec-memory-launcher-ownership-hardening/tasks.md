---
title: "Tasks: mk-spec-memory launcher-ownership hardening (O6)"
description: "Task list for the spec-memory owner-lease + heartbeat + reap port."
trigger_phrases:
  - "spec-memory launcher ownership tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/016-spec-memory-launcher-ownership-hardening"
    last_updated_at: "2026-06-05T08:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "All tasks complete; launcher-lease 11/11"
    next_safe_action: "Activates on fresh session; commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
---
# Tasks: mk-spec-memory launcher-ownership hardening (O6)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` done · `[ ]` pending. Implemented by a gpt-5.5 worker (corrected over two passes), verified by the orchestrator.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read the O6 findings + the code-index launcher reference (owner-lease + reap + heartbeat).
- [x] T002 Confirm the existing isolated `launcher-lease.vitest.ts` harness is extensible + safe to run.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 [REQ-001] Exclusive owner lease (.spec-memory-owner.json): atomic wx create + stale classification + acquire with re-read CAS.
- [x] T004 [REQ-002] refreshOwnerLeaseFile + periodic unref'd heartbeat interval; self-shutdown on refresh failure.
- [x] T005 [REQ-001] launchServer() fail-closed unless this launcher owns the lease.
- [x] T006 [REQ-003] reapOwnerBeforeRespawn + exclusive re-acquire before dead-socket takeover.
- [x] T007 [REQ-004] Retryable JSON-RPC error on report paths (no plaintext LEASE_HELD_BY on the stream).
- [x] T008 [REQ-005] launcher-lease regressions: concurrent-cold-start single-owner; dead-socket reap; JSON-RPC legacy path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 [REQ-005] launcher-lease 11/11 (orchestrator-confirmed); node --check clean.
- [x] T010 [REQ-005] comment hygiene clean; heartbeat interval unref'd + clearInterval on shutdown.
- [ ] T011 Live activation on a fresh launcher/session (outside this session's control; no live recycle performed).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Owner lease + heartbeat + reap + JSON-RPC report implemented; launcher-lease 11/11; node --check + hygiene clean.
- [ ] Confirmed live on a fresh session (pending; fresh-session activation).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Findings/recommendation: `../015-socket-server-reconvergence-and-hardening/o6-spec-memory-ownership-findings.md`.
- Reference pattern: `.opencode/bin/mk-code-index-launcher.cjs` (owner lease + reap).
<!-- /ANCHOR:cross-refs -->
