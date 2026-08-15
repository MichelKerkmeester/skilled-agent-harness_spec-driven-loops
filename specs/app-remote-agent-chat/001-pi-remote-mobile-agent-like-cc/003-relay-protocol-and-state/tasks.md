---
title: "Tasks: Relay Protocol and Durable State"
description: "Dependency-ordered task ledger for relay protocol and durable state."
trigger_phrases:
  - "pi remote relay protocol and state"
  - "pi mobile phase 3"
  - "relay protocol and state"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the task ledger with the implemented relay and command path"
    next_safe_action: "Use phase 004 for command authentication and phase 009 for operator evidence"
    blockers:
      - "No phase-specific implementation blocker"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 90
---

# Tasks: Relay Protocol and Durable State

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after its dependency |
| `[B]` | Blocked with an explicit reason |

**Task Format**: `T### [P?] Description (owned path or evidence surface)`

The relay implementation exists under `.pi/pi-remote/`. Unchecked rows remain an evidence-reconciliation ledger and do not mean implementation is absent.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm active instructions, repository surface, workspace choice, owned paths, consumers, and authoritative gate.
- [ ] T002 Re-run predecessor and version-drift checks; capture the exact negative control.
- [ ] T003 Freeze rollback, capability-disable, evidence, and secret-handling paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Finalize protocol types against phase-001 evidence and phase-002 fixtures.
- [ ] T005 [P] Implement strict-LF framing, serialized stdin writes, response correlation, event demultiplexing, and stderr isolation.
- [ ] T006 [P] Implement per-session child supervision, epochs, health, verified-idle locking, and bounded restart.
- [ ] T007 Implement versioned SQLite migrations and transaction invariants.
- [ ] T008 Implement redacted persist-before-broadcast replay, gap handling, floors, cursors, and snapshot barriers.
- [ ] T009 Implement mutation digest, outcome, conflict, and indeterminate recovery semantics.
- [ ] T010 Implement version-matched session discovery with workspace policy and opaque identifiers.
- [ ] T011 Pass recorded/live contract, storage, isolation, chaos, and bounded-backpressure gates.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run focused checks and retain exact command, output, exit, version, and environment evidence.
- [ ] T013 Run the authoritative phase gate and safe rollback or recovery exercise.
- [ ] T014 Reconcile checklist, current state, parent map, successor inputs, limitations, and scoped status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and non-deferred P1 requirements have objective evidence.
- [ ] No blocked task, failing gate, secret, temporary output, or unrelated edit remains.
- [ ] Dependent capabilities remain disabled whenever their required gate is absent or failing.
- [ ] Parent and child statuses plus the successor handoff describe the same final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent map**: [../spec.md](../spec.md)
- **Specification**: [spec.md](spec.md)
- **Plan**: [plan.md](plan.md)
- **Verification**: [checklist.md](checklist.md)
- **Decision**: [decision-record.md](decision-record.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
<!-- /ANCHOR:cross-refs -->
