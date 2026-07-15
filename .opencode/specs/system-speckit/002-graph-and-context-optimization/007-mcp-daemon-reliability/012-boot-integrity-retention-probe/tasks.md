---
title: "Tasks: boot integrity-check + retention durability + probe fix"
description: "Task Format: T### [P?] Description (file path). Implement and verify boot integrity detection, retention durability, and the liveness-probe deepProbe reap fix for mk-spec-memory."
trigger_phrases:
  - "boot integrity retention probe tasks"
  - "deepProbe reap retention durability tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented boot integrity-check, retention durability, probe deepProbe fix"
    next_safe_action: "Run strict packet validation"
    blockers: []
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000012a2"
      session_id: "007-012-boot-integrity-retention-probe-tasks"
      parent_session_id: null
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Boot Integrity-Check + Retention Durability + Probe Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `sk-code` and identify OpenCode TypeScript/Node verification route.
- [x] T002 Read `context-server.ts` boot/ready region and health-state surface.
- [x] T003 Read `vector-index-store.ts` open/close path and `getDbPath()`.
- [x] T004 Read `memory-retention-sweep.ts`, `launcher-ipc-bridge.cjs`, and sibling packets 009/010.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Write `.unclean-shutdown` marker on DB open; delete on clean close after the WAL TRUNCATE (`vector-index-store.ts`).
- [x] T011 Add marker-gated detect-only boot FTS integrity-check; derive marker path from `getDbPath()`; set health corrupt + banner + runbook on failure (`context-server.ts`).
- [x] T012 Add post-delete best-effort FTS optimize + guarded incremental_vacuum + checkpoint(TRUNCATE), outside the tx (`memory-retention-sweep.ts`).
- [x] T013 Raise `DEFAULT_PROBE_TIMEOUT_MS` to 5000 (env + clamp); require deepProbe JSON-RPC reply on the reap decision (`launcher-ipc-bridge.cjs`).
- [x] T014 Add regression assertions for the three behaviors (`*.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run MCP server workspace build.
- [x] T021 Run targeted vitest suites (385+ green).
- [x] T022 Confirm boot integrity-check is gated on marker presence and deepProbe is required on reap.
- [ ] T023 Run strict validation for this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Targeted verification and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor Packet**: `010-at-rest-wal-durability`
<!-- /ANCHOR:cross-refs -->
