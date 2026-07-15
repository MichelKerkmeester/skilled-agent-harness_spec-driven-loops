---
title: "Tasks: Dead-socket reap hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "dead-socket reap hardening tasks"
  - "lease probe retry tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/019-dead-socket-reap-hardening"
    last_updated_at: "2026-06-07T16:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked implementation + verification tasks complete"
    next_safe_action: "Phase 020 mk-code-index proxy"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-019-dead-socket-reap-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Dead-socket reap hardening

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm the single-probe reap decision in `maybeBridgeLeaseHolder` + the `MAX_PROBE_TIMEOUT_MS` grace ceiling
- [x] T002 Confirm existing ipc-bridge test expectations (alive bridges; dead respawns)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `parseNonNegativeInteger` + `resolveLeaseProbeAttempts` / `...RetryTimeoutMs` / `...RetryBackoffMs` (`launcher-ipc-bridge.cjs`)
- [x] T004 Add `probeLeaseHolderWithRetries` (injectable probe + sleep; any 'alive' short-circuits) (`launcher-ipc-bridge.cjs`)
- [x] T005 Wire it into `maybeBridgeLeaseHolder` + export the helpers (`launcher-ipc-bridge.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `node --check` + retry smoke test (9 assertions)
- [x] T007 Add `launcher-reap-hardening.vitest.ts`; pin `SPECKIT_LEASE_PROBE_RETRIES=0` in the existing single-probe respawn test
- [x] T008 Full launcher suite green (reap-hardening + ipc-bridge + watchdog + persistent-log + clean-close + session-proxy)
- [x] T009 `validate.sh --strict` for this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Tests + syntax verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
